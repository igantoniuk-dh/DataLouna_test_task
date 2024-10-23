import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { User } from 'src/interfaces/User';
import { DataSource } from 'typeorm';
import { ApiPurchaseManager } from './api-purchase.manager';
import { PurchaseDto } from './purchase.dto';

@Injectable()
export class PurchaseService {
    constructor(
        private readonly datasource: DataSource,
        private readonly httpService: HttpService,
        private readonly logger: PinoLogger
    ) {}
    async purchase(dto: PurchaseDto, user: User): Promise<ShopApiResponse> {
        return new ApiPurchaseManager(this.datasource, this.httpService, this.logger).createPurchase(dto, user);
    }
}
