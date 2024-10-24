import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/admin.guard';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { ShopApiResponse } from 'src/interfaces/ShopApiResopnse';
import { PinoLogger } from 'nestjs-pino';
import { UserNotFoundException } from './expections/UserNotFoundExecption';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly service: UserService,
        private readonly logger: PinoLogger,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}
    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const user = await this.service.login(loginDto);
            const apiResonse: ShopApiResponse = {
                message: 'login success',
                ok: true,
                code: 200,
                data: [user],
            };

            const token = this.jwtService.sign(JSON.stringify(user), { secret: this.configService.get('jwt').secret });
            res.cookie('user', token, {
                expires: new Date(Date.now() + 1000 * this.configService.get('jwt').ttlInSeconds * 60),
                httpOnly: true,
            });
            return res.status(apiResonse.code).json(apiResonse);
        } catch (error) {
            const apiResonse: ShopApiResponse = this.createLoginError(error);
            return res.status(apiResonse.code).json(apiResonse);
        }
    }

    private createLoginError(error) {
        const code = error instanceof UserNotFoundException ? 404 : 500;
        const apiResonse: ShopApiResponse = {
            message: 'login error',
            ok: false,
            code,
            data: [],
        };

        this.logger.error(
            {
                stack: error.stack,
            },
            'login error'
        );

        return apiResonse;
    }

    @UseGuards(AuthGuard)
    @Post('/changePassoword')
    async changePassoword(@Body() changePasswordDto: ChangePasswordDto, @Res() res: Response, @Req() req: Request) {
        try {
            const user = await this.service.changePassword(changePasswordDto, req['user']);
            const apiResonse: ShopApiResponse = {
                message: 'change password success',
                ok: true,
                code: 200,
                data: [user],
            };

            const token = this.jwtService.sign(JSON.stringify(user), { secret: this.configService.get('jwt').secret });

            res.cookie('user', token, {
                expires: new Date(Date.now() + 1000 * this.configService.get('jwt').ttlInSeconds * 60),
                httpOnly: true,
            });

            return res.status(apiResonse.code).json(apiResonse);
        } catch (error) {
            const code = error instanceof UserNotFoundException ? 404 : 500;
            const apiResonse: ShopApiResponse = this.createChangePasswordError(error);

            return res.status(apiResonse.code).json(apiResonse);
        }
    }

    private createChangePasswordError(error: any) {
        this.logger.error(
            {
                stack: error.stack,
            },
            'change password error'
        );
        const code = error instanceof UserNotFoundException ? 404 : 500;
        return {
            message: 'change password error',
            ok: false,
            data: [],
            code,
        };
    }
}
