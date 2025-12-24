import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceState, DeviceType } from '../enums/device.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceDto {
  @ApiProperty({ description: 'Tên thiết bị' })
  @IsOptional()
  @IsString({ message: 'Tên thiết bị không hợp lệ' })
  name?: string;

  @ApiProperty({ description: 'Địa chỉ MAC của thiết bị' })
  @IsOptional()
  @IsString({ message: 'Địa chỉ MAC không hợp lệ' })
  mac?: string;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsOptional()
  @IsString({ message: 'Loại thiết bị không hợp lệ' })
  type?: DeviceType;

  @ApiProperty({ description: 'Trạng thái thiết bị' })
  @IsOptional()
  @IsString({ message: 'Trạng thái thiết bị không hợp lệ' })
  state?: DeviceState;

  @ApiProperty({ description: 'Vị trí trong kho của thiết bị' })
  @IsOptional()
  @IsArray({ message: 'Vị trí trong kho phải là một mảng' })
  @ArrayMinSize(2, { message: 'Vị trí trong kho phải có đúng 2 phần tử' })
  @ArrayMaxSize(2, { message: 'Vị trí trong kho phải có đúng 2 phần tử' })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  locationsInWarehouse?: [number, number];

  @ApiProperty({ description: 'ID nhà kho chứa thiết bị' })
  @IsOptional()
  @IsString({ message: 'warehouseId không hợp lệ' })
  warehouseId: string;

  @ApiProperty({ description: 'ID gateway kết nối thiết bị' })
  @IsOptional()
  @IsString({ message: 'gatewayId không hợp lệ' })
  gatewayId: string;
}
