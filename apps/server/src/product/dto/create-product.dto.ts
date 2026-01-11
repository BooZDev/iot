import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Mã SKU sản phẩm' })
  @IsNotEmpty({ message: 'Mã SKU sản phẩm không được để trống' })
  @IsString({ message: 'Mã SKU sản phẩm không hợp lệ' })
  skuCode: string;

  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm không hợp lệ' })
  name: string;

  @ApiProperty({ description: 'Loai sản phẩm' })
  @IsNotEmpty({ message: 'Loại sản phẩm không được để trống' })
  @IsString()
  productTypeId: string;

  @ApiProperty({ description: 'Trạng thái luồng' })
  @IsOptional()
  @IsString({ message: 'Trạng thái luồng không hợp lệ' })
  flowState?: string;

  @ApiProperty({ description: 'Người tạo sản phẩm' })
  @IsNotEmpty({ message: 'Người tạo sản phẩm không được để trống' })
  @IsString({ message: 'createdBy không hợp lệ' })
  createdBy: string;
}
