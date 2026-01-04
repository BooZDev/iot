import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Mã nhà kho' })
  @IsNotEmpty({ message: 'Mã kho không được để trống' })
  @IsString({ message: 'Mã kho không hợp lệ' })
  warehouseCode: string;

  @ApiProperty({ description: 'Tên kho' })
  @IsNotEmpty({ message: 'Tên kho không được để trống' })
  @IsString({ message: 'Tên kho không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Loại kho' })
  @IsNotEmpty({ message: 'Loại kho không được để trống' })
  @IsString({ message: 'Loại kho không hợp lệ' })
  type: string;

  @ApiProperty({ description: 'Địa chỉ kho' })
  @IsNotEmpty({ message: 'Địa chỉ kho không được để trống' })
  @IsString({ message: 'Địa chỉ kho không hợp lệ' })
  address: string;
}
