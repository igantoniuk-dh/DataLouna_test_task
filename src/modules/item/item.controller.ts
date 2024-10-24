import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Item')
@Controller('item')
export class ItemController {
    @Get('/list')
    async list() {
        return 'dwad';
    }
}
