import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './config';
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [...configs],
            isGlobal: true,
            envFilePath: './.env',
        }),
        LoggerModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
