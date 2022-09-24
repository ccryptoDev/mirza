import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';

import { AppModule } from './app.module';
import appConfig from './app.config';

// Add JWT properties to request.user object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface User {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      screenTracking: string;
      role: string;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();
  const views = join(__dirname, '../../templates');

  nunjucks.configure(views, { express, autoescape: false, noCache: true });
  app.setBaseViewsDir(views);
  app.setViewEngine('njk');

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Buy Now Pay Later(Mirza)')
      .setDescription('Mirza API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors();

  const { serverPort } = appConfig();
  await app.listen(serverPort);
}
bootstrap();
