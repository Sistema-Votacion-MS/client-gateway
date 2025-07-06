import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Orden importante: HttpExceptionFilter primero, luego RpcCustomExceptionFilter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new RpcCustomExceptionFilter()
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Votaciones - API Gateway')
    .setDescription('API Gateway para el sistema de votaciones electrónicas. Proporciona endpoints para autenticación, gestión de usuarios y elecciones.')
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints de autenticación')
    .addTag('Users', 'Endpoints de gestión de usuarios')
    .addTag('Elections', 'Endpoints de gestión de elecciones')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(envs.port);

  logger.log(`Client Gateway is running on port ${envs.port}`);
  logger.log(`Client Gateway is running on http://localhost:${envs.port}`);
  logger.log(`Swagger documentation available at http://localhost:${envs.port}/api/docs`);
}
bootstrap();
