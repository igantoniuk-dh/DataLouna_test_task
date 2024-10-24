import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserManager } from './user.entity';
import { DataSource } from 'typeorm';
import { UserNotFoundException } from './expections/UserNotFoundExecption';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { User } from 'src/interfaces/User';

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
