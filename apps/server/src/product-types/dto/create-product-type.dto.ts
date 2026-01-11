import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTypeDto {
  @ApiProperty({ description: 'Mã loại sản phẩm' })
  @IsNotEmpty({ message: 'Mã loại sản phẩm không được để trống' })
  @IsString({ message: 'Mã loại sản phẩm không hợp lệ' })
  code: string;

  @ApiProperty({ description: 'Tên loại sản phẩm' })
  @IsNotEmpty({ message: 'Tên loại sản phẩm không được để trống' })
  @IsString({ message: 'Tên loại sản phẩm không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Mô tả loại sản phẩm' })
  @IsOptional()
  @IsString({ message: 'Mô tả loại sản phẩm không hợp lệ' })
  description?: string;
}
