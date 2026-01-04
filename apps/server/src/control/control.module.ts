import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { SubDevicesModule } from 'src/sub-devices/sub-devices.module';
import { DevicesModule } from 'src/devices/devices.module';
import { ThresholdModule } from 'src/threshold/threshold.module';

@Module({
  imports: [MqttModule, SubDevicesModule, DevicesModule, ThresholdModule],
  controllers: [ControlController],
  providers: [ControlService],
  exports: [ControlService],
})
export class ControlModule {}
