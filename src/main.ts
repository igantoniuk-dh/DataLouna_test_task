import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const IS_DEV = process.env.NODE_ENV !== 'production';
const IS_PROD = !IS_DEV;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  installSwaggerInDevMode(app);
  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
    if (IS_DEV) {
      console.log(`Swagger is running on http://localhost:${port}/api`);
    }
  });
}

function installSwaggerInDevMode(app: INestApplication) {
  if (IS_PROD) return;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Skins')
    .setDescription('The skins API description')
    .setVersion('1.0')
    .addTag('skins')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);
}
bootstrap();
