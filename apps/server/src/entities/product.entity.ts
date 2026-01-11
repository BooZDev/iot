import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProductType } from './product-type.entity';
import { ProductFlowState } from 'src/product/enums/productFlowState.enum';
import { User } from './user.entity';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true, unique: true })
  skuCode: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: ProductType.name })
  productTypeId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ProductFlowState,
    default: 'READY_IN',
  })
  flowState: ProductFlowState;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
