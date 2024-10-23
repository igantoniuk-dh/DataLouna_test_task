import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import * as cookieParser from 'cookie-parser';
// somewhere in your initialization file

const IS_DEV = process.env.NODE_ENV !== 'production';
const IS_PROD = !IS_DEV;
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    installLogger(app);
    installSwaggerInDevMode(app);
    installValidationPipe(app);
    installCookieParser(app);

    const port = process.env.PORT ?? 3000;

    await app.listen(port, () => {
        console.log(`Application is running on port ${port}`);
        if (IS_DEV) {
            console.log(`Swagger is running on http://localhost:${port}/api`);
        }
    });
}

function installLogger(app: INestApplication) {
    app.useLogger(app.get(Logger));
}

function installSwaggerInDevMode(app: INestApplication) {
    if (IS_PROD) return;

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Skins-shop')
        .setDescription('The skins-shop API description')
        .setVersion('1.0')
        .addTag('skins-shop')
        .addCookieAuth('user')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory);
}

function installValidationPipe(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe());
}

function installCookieParser(app: INestApplication) {
    app.use(cookieParser());
}
bootstrap();
