import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateWarehouseDto {
  @ApiProperty({ description: 'Tên kho' })
  @IsOptional()
  @IsString({ message: 'Tên kho không hợp lệ' })
  name?: string;

  @ApiProperty({ description: 'Loại kho' })
  @IsOptional()
  @IsString({ message: 'Loại kho không hợp lệ' })
  type?: string;

  @ApiProperty({ description: 'Vị trí kho trong bản đồ' })
  @IsOptional()
  @IsArray({ message: 'Vị trí kho phải là một mảng' })
  @ArrayMinSize(2, { message: 'Vị trí kho phải có đúng 2 phần tử' })
  @ArrayMaxSize(2, { message: 'Vị trí kho phải có đúng 2 phần tử' })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  location?: [number, number];

  @ApiProperty({ description: 'Mô tả kho' })
  @IsOptional()
  @IsString({ message: 'Mô tả kho không hợp lệ' })
  description?: string;

  @ApiProperty({ description: 'Địa chỉ kho' })
  @IsOptional()
  @IsString({ message: 'Địa chỉ kho không hợp lệ' })
  address?: string;

  @ApiProperty({ description: 'URL hình ảnh kho' })
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'imageUrl không hợp lệ' })
  imageUrl?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động của kho' })
  @IsOptional()
  @IsBoolean({ message: 'isActive phải là giá trị boolean' })
  isActive?: boolean;
}
