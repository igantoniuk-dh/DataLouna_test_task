import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    newPassword: string;
}
