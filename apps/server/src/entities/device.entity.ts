import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Warehouse } from './warehouse.entity';
import { DeviceState, DeviceType } from 'src/devices/enums/device.enum';

export type PopulateDevice = Device & {
  gatewayId: Device;
};

@Schema({
  timestamps: true,
})
export class Device {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  mac: string;

  @Prop({ type: String, required: true })
  type: DeviceType;

  @Prop({ type: String, required: true, default: DeviceState.UNAUTHORIZED })
  state: DeviceState;

  @Prop({ type: [Number, Number], required: false })
  locationsInWarehouse: Array<number>;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, ref: Device.name })
  gatewayId: Types.ObjectId;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
