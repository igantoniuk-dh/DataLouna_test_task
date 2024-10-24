import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from 'src/guards/admin.guard';
import { ItemService } from './item.service';

@ApiTags('Item')
@Controller('item')
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
@CacheTTL(1000 * 60 * 60 * 4)
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly logger: PinoLogger
    ) {}
    @Get('/list')
    @ApiQuery({ name: 'page', type: Number })
    @ApiQuery({ name: 'pageSize', type: Number })
    async list(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        try {
            const response = await this.itemService.getIgems({
                page: Math.abs(+page) || 1,
                pageSize: Math.abs(+pageSize) || 10,
            });

            return response;
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

            return response;
        }
    }
}
