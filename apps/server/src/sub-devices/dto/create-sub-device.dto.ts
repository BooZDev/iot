import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubDeviceDto {
  @ApiProperty({ description: 'Mã thiết bị' })
  @IsNotEmpty({ message: 'Thiếu mã thiết bị' })
  @IsString({ message: 'Mã thiết bị không hợp lệ' })
  code: string;

  @ApiProperty({ description: 'Tên thiết bị' })
  @IsNotEmpty({ message: 'Thiếu tên thiết bị' })
  @IsString({ message: 'Tên thiết bị không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsNotEmpty({ message: 'Thiếu loại thiết bị' })
  @IsNumber({}, { message: 'Loại thiết bị không hợp lệ' })
  type: number;

  @ApiProperty({ description: 'ID thiết bị cha' })
  @IsNotEmpty({ message: 'Thiếu deviceId' })
  @IsMongoId({ message: 'deviceId không hợp lệ' })
  deviceId: string;
}
