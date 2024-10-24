import { Inject, Injectable } from '@nestjs/common';
import { ItemManager } from './item.manager';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ItemService {
    constructor(
        private readonly datasource: DataSource,
        private readonly httpService: HttpService,
        private readonly logger: PinoLogger,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
    async getIgems(opts: { page: number; pageSize: number }) {
        return new ItemManager(this.datasource, this.httpService, this.logger, this.cacheManager).get(opts);
    }

    @Cron('0 */2 * * *')
    async updateItemsEvery2Hours() {
        await this.cacheManager.reset();
        await new ItemManager(
            this.datasource,
            this.httpService,
            this.logger,
            this.cacheManager
        ).getItemsFromApiAndStoreToDb();
    }
}
