import { HttpService } from '@nestjs/axios';
import * as _ from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';
import { Item } from 'src/interfaces/Item';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { ItemsNotFetchException } from './exceptions/ItemsNotFetchExpection';
import { ItemsUnexpectingResponse } from './exceptions/ItemsUnexpectingResponse';

const skinItemSchema = z.object({
    id: z.string().optional(),
    market_hash_name: z.string(),
    currency: z.string(),
    suggested_price: z.number(),
    item_page: z.string(),
    market_page: z.string(),
    min_price: z.number(),
    max_price: z.number(),
    mean_price: z.number(),
    median_price: z.number(),
    quantity: z.number(),
    created_at: z.union([z.number(), z.string()]),
    updated_at: z.union([z.number(), z.string()]),
});

type SkinItem = z.infer<typeof skinItemSchema>;

const updateCols = [
    'currency',
    'suggested_price',
    'item_page',
    'market_page',
    'min_price',
    'max_price',
    'mean_price',
    'median_price',
    'quantity',
    'created_at',
    'updated_at',
];
const idCols = ['market_hash_name'];

export class ItemManager {
    constructor(
        private datasource: DataSource,
        private httpService: HttpService,
        private logger: PinoLogger
    ) {}
    async get(opts: { page: number; pageSize: number }): Promise<ShopApiResponse<Item>> {
        try {
            const { page, pageSize } = opts;

            const totalCount = await this.totalCountOfItems();

            if (!totalCount) throw new ItemsNotFetchException();
            const itemsFromStore = await this.getItemsFromPg(opts);

            return {
                data: itemsFromStore.map(item =>
                    this.mapItemToApi({
                        ...item,
                        id: item.id as string,
                    })
                ),
                ok: true,
                message: 'success fetch item',
                code: 200,
                pagination: {
                    page,
                    pageSize,
                    totalCount,
                },
            };
        } catch (e) {
            if (e instanceof ItemsNotFetchException) return this.getItemsFromApiAndStoreToDb(opts);
            throw e;
        }
    }
    private async totalCountOfItems(): Promise<number> {
        const runner = this.datasource.createQueryRunner();
        const qRyAndParams = this.datasource
            .createQueryBuilder(runner)
            .select('count(*)')
            .from('items', 'it')

            .getQueryAndParameters();

        const count = await this.datasource.manager.query(qRyAndParams[0], qRyAndParams[1]);
        const countFromPg = +count[0].count;

        return countFromPg;
    }

    async getItemsFromPg(opts?: { page: number; pageSize: number }): Promise<Item[]> {
        const runner = this.datasource.createQueryRunner();

        const offset = (opts?.page - 1) * opts?.pageSize;
        const limit = opts?.pageSize;
        const qRyAndParams = this.datasource
            .createQueryBuilder(runner)
            .select('*')
            .from('items', 'it')
            .offset(offset)
            .limit(limit)
            .orderBy('it.market_hash_name', 'ASC')

            .getQueryAndParameters();

        return this.datasource.manager.query(qRyAndParams[0], qRyAndParams[1]);
    }

    mapItemToApi(item: SkinItem) {
        const [tradablePrice, notTradablePrice] = [
            +item.min_price,
            +item.max_price,
            +item.suggested_price,
            +item.mean_price,
            +item.median_price,
        ].sort();

        return {
            name: item.market_hash_name,
            id: item.id,
            tradablePrice,
            notTradablePrice,
        };
    }
    async getItemsFromApiAndStoreToDb(opts?: { page: number; pageSize: number }): Promise<ShopApiResponse<Item>> {
        const apiData = await this.getItemsFromApi();

        const chunkedItems = _.chunk(apiData, 1000);
        for (const chunk of chunkedItems) {
            await this.saveItemsToDb(chunk);
        }

        return this.get(opts);
    }

    private async getItemsFromApi() {
        const obs = this.httpService.get('https://api.skinport.com/v1/items');
        const items = await lastValueFrom(obs).then(res => res.data);

        if (!(items instanceof Array)) {
            throw new ItemsUnexpectingResponse();
        }

        const fixedItems = items.map(item => this.fixItem(item));

        const validItems = [];
        const invalidItems = [];

        for (let i = 0; i < fixedItems.length; ++i) {
            try {
                const item = skinItemSchema.parse(fixedItems[i]);
                validItems.push(item);
            } catch (e) {
                invalidItems.push(fixedItems[i]);
            }
        }

        if (invalidItems.length) this.logger.warn({ invalidItems }, 'this items cannot be stored, broken format');

        return validItems;
    }

    private fixItem(item: SkinItem) {
        return {
            ...item,
            created_at: new Date((item.created_at as number) * 1000).toISOString(),
            updated_at: new Date((item.updated_at as number) * 1000).toISOString(),
            min_price: item.min_price || 0,
            max_price: item.max_price || 0,
            mean_price: item.mean_price || 0,
            currency: item.currency || 'EUR',
            suggested_price: item.suggested_price || 0,
            item_page: item.item_page || '',
            market_page: item.market_page || '',
            median_price: item.median_price || 0,
            quantity: item.quantity || 0,
        };
    }

    private async saveItemsToDb(items: unknown[]) {
        const runner = this.datasource.createQueryRunner();

        const qRyAndParams = this.datasource
            .createQueryBuilder(runner)
            .insert()
            .into('items', [...idCols, ...updateCols])
            .values(
                items.map((item: SkinItem) => ({
                    ...item,
                }))
            )

            .getQueryAndParameters();

        let updateClause = '';
        updateCols.forEach(key => {
            updateClause += `${key} = excluded.${key},`;
        });
        updateClause = updateClause.slice(0, -1);

        await this.datasource.manager.query(
            `${qRyAndParams[0]} on conflict (market_hash_name) do update set ${updateClause}`,
            qRyAndParams[1]
        );
    }
}
