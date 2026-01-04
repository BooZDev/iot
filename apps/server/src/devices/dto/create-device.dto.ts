import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceType } from '../enums/device.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ description: 'Mã thiết bị' })
  @IsNotEmpty({ message: 'Mã thiết bị không được để trống' })
  @IsString({ message: 'Mã thiết bị không hợp lệ' })
  deviceCode: string;

  @ApiProperty({ description: 'Tên thiết bị' })
  @IsNotEmpty({ message: 'Tên thiết bị không được để trống' })
  @IsString({ message: 'Tên thiết bị không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsNotEmpty({ message: 'Loại thiết bị không được để trống' })
  @IsEnum(DeviceType, {
    message: 'Loại thiết bị phải là gateway, envSensor, other hoặc rfidReader',
  })
  type: DeviceType;

  @ApiProperty({ description: 'Địa chỉ MAC của thiết bị' })
  @IsNotEmpty({ message: 'Địa chỉ MAC không được để trống' })
  @IsString({ message: 'Địa chỉ MAC không hợp lệ' })
  mac: string;

  @ApiProperty({ description: 'ID nhà kho chứa thiết bị' })
  @IsOptional()
  @IsMongoId({ message: 'warehouseId không hợp lệ' })
  warehouseId?: string;

  @ApiProperty({ description: 'ID gateway kết nối thiết bị' })
  @IsOptional()
  @IsMongoId({ message: 'gatewayId không hợp lệ' })
  gatewayId?: string;
}
