import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { ClientsModule } from '@nestjs/microservices';
import { mqttConfig } from './config/mqtt.config';
import { DataModule } from 'src/data/data.module';
import { DevicesModule } from 'src/devices/devices.module';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [
    ClientsModule.register([mqttConfig]),
    DataModule,
    DevicesModule,
    RealtimeModule,
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
