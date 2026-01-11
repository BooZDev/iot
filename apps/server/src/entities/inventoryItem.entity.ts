import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  quantity: number;

  @Prop({ type: Date, required: true, default: null })
  lastInAt: Date;

  @Prop({ type: Date, required: false, default: null })
  lastOutAt: Date;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
