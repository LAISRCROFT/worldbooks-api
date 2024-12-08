import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import dotenvFlow = require('dotenv-flow');
import * as bodyParser from 'body-parser';

async function bootstrap() {
  dotenvFlow.config();
  
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  app.use(bodyParser.json({ limit: '10mb' })); // Ajuste conforme necessário
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('WB-back-V2')
    .setDescription('WB-back-V2')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors();
  await app.listen(4001, '0.0.0.0');
  console.log(`Application is running on ${await app.getUrl()}`)
}
bootstrap();