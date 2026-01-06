import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Warehouse, WarehouseSchema } from 'src/entities/warehouse.entity';
import { DevicesModule } from 'src/devices/devices.module';
import { SubDevicesModule } from 'src/sub-devices/sub-devices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
    DevicesModule,
    SubDevicesModule,
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
