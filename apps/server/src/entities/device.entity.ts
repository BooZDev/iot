import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Device {
  @Prop({ type: String, required: true, unique: true })
  mac: string;

  @Prop({ type: String, required: true, unique: true })
  deviceId: string;

  @Prop({ type: String, required: false })
  location: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true, default: 'inactive' })
  status: string;

  @Prop({ type: [Types.ObjectId], required: false, ref: 'Diveces' })
  node: Types.ObjectId[];
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
