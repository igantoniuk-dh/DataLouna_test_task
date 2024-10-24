import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
    @Post('/purchase')
    async purchasse() {
        return 'purchase';
    }
}
