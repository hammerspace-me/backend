import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const version = process.env.npm_package_version || 'LTS';
  const config = new DocumentBuilder()
    .setTitle('Hammerspace backend')
    .setDescription(
      "Backend service documentation for Hammerspace. Hammerspace helps you move and express yourself in games and metaverses. Hammerspace's focus is to enable interoperability and seamlessness. Check out <a href='https://hammerspace.me'>https://hammerspace.me</a> to learn more.",
    )
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
