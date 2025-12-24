import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubDeviceDto {
  @ApiProperty({ description: 'Tên thiết bị' })
  @IsNotEmpty({ message: 'Thiếu tên thiết bị' })
  @IsString({ message: 'Tên thiết bị không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsNotEmpty({ message: 'Thiếu loại thiết bị' })
  @IsString({ message: 'Loại thiết bị không hợp lệ' })
  type: string;

  @ApiProperty({ description: 'ID thiết bị cha' })
  @IsNotEmpty({ message: 'Thiếu deviceId' })
  @IsMongoId({ message: 'deviceId không hợp lệ' })
  deviceId: string;
}
