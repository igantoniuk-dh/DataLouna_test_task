import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, InternalServerErrorException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
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
            const apiResponse = await this.itemService.getIgems({
                page: Math.abs(+page) || 1,
                pageSize: Math.abs(+pageSize) || 10,
            });

            return apiResponse;
        } catch (e) {
            const apiResponse = {
                code: 500,
                message: 'FETCH_ITEM_ERROR',
                data: [],
                ok: false,
            };
            this.logger.error({
                message: 'FETCH_ITEM_ERROR',
                stack: e.stack,
            });
            throw new InternalServerErrorException(HttpErrorByCode[500], JSON.stringify(apiResponse));
        }
    }
    @Post('/reset-cache')
    async resetCache() {
        await this.itemService.resetCache();

        return {
            code: 200,
            message: 'CACHE_RESET_SUCCESS',
            data: [],
            ok: true,
        };
    }
}
