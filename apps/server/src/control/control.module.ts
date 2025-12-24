import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { SubDevicesModule } from 'src/sub-devices/sub-devices.module';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [MqttModule, SubDevicesModule, DevicesModule],
  controllers: [ControlController],
  providers: [ControlService],
})
export class ControlModule {}
