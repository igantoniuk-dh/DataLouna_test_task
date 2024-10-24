import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/admin.guard';
import { ItemService } from './item.service';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@ApiTags('Item')
@Controller('item')
@UseGuards(AuthGuard)
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly logger: PinoLogger
    ) {}
    @Get('/list')
    @ApiQuery({ name: 'page', type: Number })
    @ApiQuery({ name: 'pageSize', type: Number })
    async list(@Query('page') page: string, @Query('pageSize') pageSize: string, @Res() res: Response) {
        try {
            const response = await this.itemService.getIgems({
                page: Math.abs(+page) || 1,
                pageSize: Math.abs(+pageSize) || 10,
            });

            return res.status(response.code).json(response);
        } catch (e) {
            const response = {
                code: 500,
                message: 'fetch items error',
                data: [],
                ok: false,
            };
            this.logger.error({
                message: e.message,
                stack: e.stack,
            });

            return res.status(response.code).json(response);
        }
    }
}
