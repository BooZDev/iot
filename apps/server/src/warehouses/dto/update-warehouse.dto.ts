import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PolygonValidator', async: false })
class PolygonValidator implements ValidatorConstraintInterface {
  validate(locations: [number, number][]) {
    if (locations.length < 3) return false;

    const first = locations[0];
    const last = locations[locations.length - 1];

    // polygon phải đóng
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'Polygon must be closed (first point = last point)';
  }
}

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
  @IsArray({ message: 'Vị trí kho không hợp lệ' })
  @ArrayMinSize(4, { message: 'Phải có 3 tọa độ' })
  @Validate(PolygonValidator)
  locations?: [number, number][];

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
