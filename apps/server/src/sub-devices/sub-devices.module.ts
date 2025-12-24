import { Module } from '@nestjs/common';
import { SubDevicesService } from './sub-devices.service';
import { SubDevicesController } from './sub-devices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubDevice, SubDeviceSchema } from 'src/entities/sub-device.entity';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubDevice.name, schema: SubDeviceSchema },
    ]),
    DevicesModule,
  ],
  controllers: [SubDevicesController],
  providers: [SubDevicesService],
  exports: [SubDevicesService],
})
export class SubDevicesModule {}
