import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PurchaseDto {
    @ApiProperty()
    @IsString()
    itemId: string;
}
