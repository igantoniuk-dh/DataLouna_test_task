import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [...configs],
            isGlobal: true,
        }),
        LoggerModule.forRoot(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return configService.get('typeorm');
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
