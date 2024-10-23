import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
    @IsDefined()
    @IsString()
    @ApiProperty()
    login: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    password: string;
}
