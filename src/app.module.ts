import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerModule } from 'nestjs-pino';
import configs from './config';
import { ItemModule } from './modules/item/item.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { UserModule } from './modules/user/user.module';

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
                return {
                    ...configService.get('typeorm'),
                };
            },
        }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return configService.get('jwt');
            },
        }),
        CacheModule.registerAsync({
            inject: [ConfigService],

            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    store: await redisStore({
                        socket: {
                            ...configService.get('redis'),
                        },
                    }),
                };
            },
        }),

        ScheduleModule.forRoot(),
        UserModule,
        ItemModule,
        PurchaseModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule {}
