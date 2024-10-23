import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseDto } from './purchase.dto';
import { PurchaseService } from './purchase.service';
import { Request, Response } from 'express';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { NotEnoughMoneyException } from './exceptions/NotEnoughMoneyException';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from 'src/guards/admin.guard';
import { ItemNotFoundException } from '../item/exceptions/ItemNotFoundException';
@ApiTags('Purchase')
@UseGuards(AuthGuard)
@Controller('purchase')
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly logger: PinoLogger
    ) {}
    @Post('/')
    async purchasse(@Body() body: PurchaseDto, @Req() req: Request, @Res() res: Response) {
        try {
            const sucResponse = await this.purchaseService.purchase(body, req['user']);
            return res.status(sucResponse.code).json(sucResponse);
        } catch (e) {
            let code = 500;
            let message = 'CREATE_PURCHASE_ERROR';
            if (e instanceof NotEnoughMoneyException) {
                code = 400;
                message = 'NOT_ENOUGH_MONEY';
            }
            if (e instanceof ItemNotFoundException) {
                code = 404;
                message = 'ITEM_NOT_FOUND';
            }
            const errResponse: ShopApiResponse = {
                ok: false,
                message,
                data: [],
                code,
            };
            this.logger.error({
                error: 'CREATE_PURCHASE_ERROR',
                stack: e.stack,
            });
            return res.status(code).json(errResponse);
        }
    }
}
