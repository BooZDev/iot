import { IsDate, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import type { DataType } from '../types/data.type';

export class CreateDataDto {
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsNotEmpty()
  metadata: Types.ObjectId;

  @IsNotEmpty()
  warehouseId: Types.ObjectId;

  @IsNotEmpty()
  data: DataType;
}
