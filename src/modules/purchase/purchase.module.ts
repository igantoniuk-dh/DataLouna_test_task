import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [PurchaseController],
    providers: [JwtService, PurchaseService],
})
export class PurchaseModule {}
