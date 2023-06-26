import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions} from '@nestjs/swagger'; 
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Practise API')
    .setDescription('Practise swagger in nest js')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your access token'
    })
    .build();
  
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    }
  }
  const document = SwaggerModule.createDocument(app,swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, customOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(5000);
  console.log(`App listening at port ${5000}`);
}
bootstrap();
