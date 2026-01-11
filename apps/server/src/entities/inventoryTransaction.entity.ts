import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { User } from './user.entity';
import { Device } from './device.entity';

export enum InventoryTransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

export enum InventoryTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class InventoryTransaction {
  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: InventoryTransactionType,
  })
  transactionType: InventoryTransactionType;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  operatorId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: InventoryTransactionStatus,
    default: InventoryTransactionStatus.PENDING,
  })
  status: InventoryTransactionStatus;

  @Prop({ type: String, required: true, ref: Device.name })
  rfidTagId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  requestTime: Date;
}

export const InventoryTransactionSchema =
  SchemaFactory.createForClass(InventoryTransaction);
