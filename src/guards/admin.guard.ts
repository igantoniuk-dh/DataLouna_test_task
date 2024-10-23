import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private readonly datasource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookies(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = this.jwtService.verify(token, this.config.get('jwt'));
            const parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;

            request['user'] = parsedPayload;
        } catch (e) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromCookies(request: Request): string | undefined {
        const cookies = request.cookies;

        if (!cookies) return null;

        return cookies['user'];
    }
}
