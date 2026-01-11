import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';
import { RealtimeModule } from './realtime/realtime.module';
import { DataModule } from './data/data.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { DevicesModule } from './devices/devices.module';
import { ControlModule } from './control/control.module';
import { SubDevicesModule } from './sub-devices/sub-devices.module';
import { AlertModule } from './alert/alert.module';
import { ThresholdModule } from './threshold/threshold.module';
import { ProductModule } from './product/product.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { InventoryModule } from './inventory/inventory.module';
import { OutboundScheduleModule } from './outbound-schedule/outbound-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    UserModule,
    AuthModule,
    DataModule,
    WarehousesModule,
    DevicesModule,
    ControlModule,
    RealtimeModule,
    MqttModule,
    SubDevicesModule,
    AlertModule,
    ThresholdModule,
    ProductModule,
    ProductTypesModule,
    InventoryModule,
    OutboundScheduleModule,
  ],
})
export class AppModule {}
