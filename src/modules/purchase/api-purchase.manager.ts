import { DataSource, QueryRunner } from 'typeorm';
import { PurchaseDto } from './purchase.dto';
import { User } from 'src/interfaces/User';
import { PinoLogger } from 'nestjs-pino';
import { ApiUserManager } from '../user/api-user.manager';
import { ApiItemManager } from '../item/api-item.manager';
import { HttpService } from '@nestjs/axios';
import { Item } from 'src/interfaces/Item';
import { NotEnoughMoneyException } from './exceptions/NotEnoughMoneyException';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';

export class ApiPurchaseManager {
    private ApiUserManager: ApiUserManager;
    private itemManager: ApiItemManager;
    constructor(
        private readonly datasource: DataSource,
        private readonly httpService: HttpService,
        private readonly logger: PinoLogger
    ) {
        this.ApiUserManager = new ApiUserManager(datasource);
        this.itemManager = new ApiItemManager(datasource, this.httpService, logger);
    }

    // eslint-disable-next-line max-lines-per-function
    async createPurchase(dto: PurchaseDto, user: User): Promise<ShopApiResponse<{ newBalance: number }>> {
        const runner = this.datasource.createQueryRunner();
        await runner.connect();
        try {
            await runner.startTransaction();

            const userActualInfo: User = await this.ApiUserManager.getById({ userId: user.id, qrunner: runner });

            const item: Item = await this.itemManager.getById({
                itemId: dto.itemId,
                qrunner: runner,
            });

            if (userActualInfo.balance < item.tradablePrice) throw new NotEnoughMoneyException();

            const newBalance = +userActualInfo.balance - item.tradablePrice;

            await this.ApiUserManager.updateBalance({ userId: user.id, newBalance, qrunner: runner });

            await this.createPartitionIfNeed({ userId: user.id, qrunner: runner });
            const [query, params] = this.createInsertPurchaseQuery({ userId: userActualInfo.id, item });

            await runner.query(query, params);

            await runner.commitTransaction();
            return {
                code: 200,
                message: 'CREATE_PURCHASE_SUCCESS',
                data: [{ newBalance }],
                ok: true,
            };
        } catch (e) {
            this.logger.error({
                error: 'CREATE_PURCHASE_ERROR',
                stack: e.stack,
            });

            await runner.rollbackTransaction();
            await runner.release();
            throw e;
        } finally {
            await runner.release();
        }
    }

    private async createPartitionIfNeed(opts: { userId: string; qrunner: QueryRunner }) {
        const { userId, qrunner } = opts;
        const runner = qrunner || this.datasource.createQueryRunner();
        if (!qrunner) {
            await runner.connect();
        }
        try {
            const tableName = this.createTableName(userId);

            const isPartitionExists = await runner
                .query(
                    `SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE  table_name   = '${tableName}'
                );
        `
                )
                .then(res => res[0]?.exists);

            if (isPartitionExists) return;

            const q = `CREATE TABLE ${tableName} PARTITION OF purchases FOR VALUES IN ('${userId}');`;
            console.table({ q });

            await runner.query(q);
        } finally {
            if (!qrunner) {
                await runner.release();
            }
        }
    }

    private createInsertPurchaseQuery(opts: { userId: string; item: Item }): [string, unknown[]] {
        const { userId, item } = opts;
        return this.datasource
            .createQueryBuilder()
            .insert()
            .into(this.createTableName(userId))
            .values({
                user_id: userId,
                item_id: item.id,
                price: item.tradablePrice,
            })
            .returning('*')
            .getQueryAndParameters();
    }

    private createTableName(userId: string) {
        return `purchases_${userId.toLocaleLowerCase().replaceAll('-', '_')}`;
    }
}
