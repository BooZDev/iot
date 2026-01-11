import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { ClientsModule } from '@nestjs/microservices';
import { mqttConfig } from './config/mqtt.config';
import { DataModule } from 'src/data/data.module';
import { DevicesModule } from 'src/devices/devices.module';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { AlertModule } from 'src/alert/alert.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/entities/product.entity';
import {
  InventoryItem,
  InventoryItemSchema,
} from 'src/entities/inventoryItem.entity';
import {
  InventoryTransaction,
  InventoryTransactionSchema,
} from 'src/entities/inventoryTransaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: InventoryItem.name, schema: InventoryItemSchema },
      { name: InventoryTransaction.name, schema: InventoryTransactionSchema },
    ]),
    ClientsModule.register([mqttConfig]),
    DataModule,
    DevicesModule,
    RealtimeModule,
    AlertModule,
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
