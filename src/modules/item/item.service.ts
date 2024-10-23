import { Inject, Injectable } from '@nestjs/common';
import { ApiItemManager } from './api-item.manager';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ItemService {
    private cacheKey = 'cache-items';
    constructor(
        private readonly datasource: DataSource,
        private readonly httpService: HttpService,
        private readonly logger: PinoLogger,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
    async getIgems(opts: { page: number; pageSize: number }) {
        const data = await new ApiItemManager(this.datasource, this.httpService, this.logger).get(opts);
        return data;
    }

    @Cron('0 */2 * * *')
    async updateItemsEvery2Hours() {
        await this.cacheManager.reset();
        await new ApiItemManager(this.datasource, this.httpService, this.logger).getItemsFromApiAndStoreToDb();
    }

    async resetCache() {
        await this.cacheManager.reset();
    }
}
