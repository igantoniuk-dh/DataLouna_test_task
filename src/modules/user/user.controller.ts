import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from 'src/guards/admin.guard';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { User } from 'src/interfaces/User';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/login.dto';
import { EnvironmentException } from './exceptions/EnvorinmentException';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly service: UserService,
        private readonly logger: PinoLogger,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    private cookieOpts = {
        expires: this.getCookieExpires(),
        httpOnly: true,
    };

    private getCookieExpires() {
        return new Date(Date.now() + 1000 * this.configService.get('jwt').ttlInSeconds * 60);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const apiResonse = await this.service.login(loginDto);

            const token = this.createToken(apiResonse.data[0]);
            res.cookie('user', token, this.cookieOpts);
            res.status(apiResonse.code).json(apiResonse);
        } catch (error) {
            const apiResonse: ShopApiResponse = this.createLoginError(error);
            res.status(apiResonse.code).json(apiResonse);
        }
    }

    private createToken(user: User) {
        return this.jwtService.sign(JSON.stringify(user), {
            secret: this.configService.get('jwt').secret,
        });
    }

    private createLoginError(error) {
        const code = error instanceof UserNotFoundException ? 404 : 500;
        const apiResonse: ShopApiResponse = {
            message: 'LOGIN_ERROR',
            ok: false,
            code,
            data: [],
        };

        this.logger.error(
            {
                stack: error.stack,
            },
            'LOGIN_ERROR'
        );

        return apiResonse;
    }

    @UseGuards(AuthGuard)
    @Post('/changePassword')
    async changePassoword(@Body() changePasswordDto: ChangePasswordDto, @Res() res: Response, @Req() req: Request) {
        try {
            const apiResonse = await this.service.changePassword(changePasswordDto, req['user']);
            const token = this.createToken(apiResonse.data[0]);

            res.cookie('user', token, this.cookieOpts);

            res.status(apiResonse.code).json(apiResonse);
        } catch (error) {
            const apiResonse: ShopApiResponse = this.createChangePasswordError(error);

            res.status(apiResonse.code).json(apiResonse);
        }
    }

    private createChangePasswordError(error) {
        this.logger.error(
            {
                stack: error.stack,
            },
            'CHANGE_PASSWORD_ERROR'
        );
        const code = error instanceof UserNotFoundException ? 404 : 500;
        return {
            message: 'CHANGE_PASSWORD_ERROR',
            ok: false,
            data: [],
            code,
        };
    }

    @Get('/test-user-token')
    async testUserData(@Res() res: Response) {
        try {
            if (process.env.NODE_ENV !== 'test') throw new EnvironmentException();

            const testUserData = await this.service.getTestUser();
            const token = this.createToken(testUserData);
            res.status(200).json({
                message: 'test-user-token',
                ok: true,
                code: 200,
                data: [token],
            });
        } catch (e) {
            res.status(500).json({
                message: 'test-user-token',
                ok: false,
                code: 500,
                data: [],
            });
        }
    }
}
