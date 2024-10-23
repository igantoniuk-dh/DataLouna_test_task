import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { User } from 'src/interfaces/User';
import { DataSource } from 'typeorm';
import { ApiUserManager } from './api-user.manager';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly datasource: DataSource,
        private readonly config: ConfigService
    ) {}
    async login(dto: LoginDto): Promise<ShopApiResponse<User>> {
        return await new ApiUserManager(this.datasource).login(dto);
    }

    async changePassword(dto: ChangePasswordDto, user: User): Promise<ShopApiResponse<User>> {
        return await new ApiUserManager(this.datasource).changePassword(dto, user);
    }

    async getTestUser() {
        return await new ApiUserManager(this.datasource).getUserByLogin({ login: this.config.get('admin').login });
    }
}
