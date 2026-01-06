import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SubDeviceState, SubDeviceStatus } from '../enums/sub-device.enum';
import { Types } from 'mongoose';

export class UpdateSubDeviceDto {
  @ApiProperty({ description: 'Mã thiết bị' })
  @IsOptional({ message: 'Mã thiết bị không hợp lệ' })
  @IsString({ message: 'Mã thiết bị không hợp lệ' })
  code?: string;

  @ApiProperty({ description: 'Tên thiết bị' })
  @IsOptional({ message: 'Tên thiết bị không hợp lệ' })
  @IsString({ message: 'Tên thiết bị không hợp lệ' })
  name?: string;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsOptional({ message: 'Loại thiết bị không hợp lệ' })
  @IsString({ message: 'Loại thiết bị không hợp lệ' })
  type?: string;

  @ApiProperty({ description: 'Trạng thái thiết bị' })
  @IsOptional({ message: 'Trạng thái thiết bị không hợp lệ' })
  @IsEnum(SubDeviceStatus, {
    message: 'Trạng thái thiết bị phải là on, off hoặc maintenance',
  })
  status?: SubDeviceStatus;

  @ApiProperty({ description: 'Trạng thái hoạt động của thiết bị' })
  @IsOptional({ message: 'Trạng thái thiết bị không hợp lệ' })
  @IsEnum(SubDeviceState, {
    message: 'Trạng thái thiết bị phải là active hoặc inactive',
  })
  state?: SubDeviceState;

  @ApiProperty({ description: 'Giá trị của thiết bị' })
  @IsOptional({ message: 'Giá trị thiết bị không hợp lệ' })
  @IsNumber({}, { message: 'Giá trị thiết bị không hợp lệ' })
  value?: number;

  @ApiProperty({ description: 'ID thiết bị cha' })
  @IsOptional({ message: 'deviceId không hợp lệ' })
  @IsMongoId({ message: 'deviceId không hợp lệ' })
  deviceId?: Types.ObjectId;
}
