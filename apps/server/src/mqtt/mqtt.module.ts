import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { ClientsModule } from '@nestjs/microservices';
import { mqttConfig } from './config/mqtt.config';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [ClientsModule.register([mqttConfig]), DataModule],
  controllers: [MqttController],
  providers: [MqttService],
})
export class MqttModule {}
