import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './config';
/** This will be displayed as an interface */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [...configs],
            isGlobal: true,
            envFilePath: './.env',
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private readonly configService: ConfigService) {}
}
