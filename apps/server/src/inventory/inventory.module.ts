import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryItem,
  InventoryItemSchema,
} from 'src/entities/inventoryItem.entity';
import {
  InventoryTransaction,
  InventoryTransactionSchema,
} from 'src/entities/inventoryTransaction.entity';
import { ProductModule } from 'src/product/product.module';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { DevicesModule } from 'src/devices/devices.module';
import { OutboundScheduleModule } from 'src/outbound-schedule/outbound-schedule.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryItem.name, schema: InventoryItemSchema },
      { name: InventoryTransaction.name, schema: InventoryTransactionSchema },
    ]),
    MqttModule,
    DevicesModule,
    OutboundScheduleModule,
    ProductModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
