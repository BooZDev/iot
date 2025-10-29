import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://warehouse.eladev.site:1883',
      clientId: 'nest-subscriber',
      username: 'nest_server',
      password: 'n12345678',
      clean: true,
      reconnectPeriod: 2000,
    },
  });

  app.enableCors({
    origin: '*', //'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 5001);
}

bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
