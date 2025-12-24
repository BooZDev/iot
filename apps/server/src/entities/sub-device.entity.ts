import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  SubDeviceState,
  SubDeviceStatus,
} from 'src/sub-devices/enums/sub-device.enum';
import { Device, PopulateDevice } from './device.entity';

export type PopulateSubDevice = SubDevice & {
  deviceId: PopulateDevice;
};

@Schema({
  timestamps: true,
})
export class SubDevice {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true, default: SubDeviceStatus.OFF })
  status: SubDeviceStatus;

  @Prop({ type: String, required: true, default: SubDeviceState.INACTIVE })
  state: SubDeviceState;

  @Prop({ type: Number, required: false })
  value: number;

  @Prop({ type: Types.ObjectId, required: true, ref: Device.name })
  deviceId: Types.ObjectId;
}

export const SubDeviceSchema = SchemaFactory.createForClass(SubDevice);
