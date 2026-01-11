import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { User } from './user.entity';

@Schema({ timestamps: true })
export class OutboundSchedule {
  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startAt: Date;

  @Prop({ type: Date, required: true })
  endAt: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  createdBy: Types.ObjectId;
}

export const OutboundScheduleSchema =
  SchemaFactory.createForClass(OutboundSchedule);
