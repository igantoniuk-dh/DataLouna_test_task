import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

@Injectable()
export class AppService {
    constructor() {}
    getHello(): string {
        return 'Hello World!';
    }
}
