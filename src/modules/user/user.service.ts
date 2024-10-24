import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/User';
import { DataSource } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/login.dto';
import { UserManager } from './user.entity';

@Injectable()
export class UserService {
    constructor(private readonly datasource: DataSource) {}
    async login(dto: LoginDto) {
        return await new UserManager(this.datasource).login(dto);
    }

    async changePassword(dto: ChangePasswordDto, user: User) {
        return await new UserManager(this.datasource).changePassword(dto, user);
    }
}
