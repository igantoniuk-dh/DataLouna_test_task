import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configs from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ItemModule } from './modules/item/item.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { JwtModule } from '@nestjs/jwt';

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
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return configService.get('jwt');
            },
        }),
        UserModule,
        ItemModule,
        PurchaseModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
