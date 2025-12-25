import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MqttOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*', //'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.connectMicroservice<MqttOptions>({
    transport: Transport.MQTT,
    options: {
      clientId: process.env.MQTT_CLIENT_ID_1 || 'server-sub',
      url: process.env.MQTT_ULR,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      rejectUnauthorized: false,
      keepalive: 60,
      reconnectPeriod: 1000,
    },
  });

  app.startAllMicroservices().catch((err) => {
    console.error('Error starting microservices:', err);
  });

  const config = new DocumentBuilder()
    .setTitle('Werehouse Api')
    .setDescription('The Werehouse API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  document.security = [{ 'access-token': [] }];
  SwaggerModule.setup('backend-api', app, document);

  await app.listen(process.env.PORT ?? 5001);
}

bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
