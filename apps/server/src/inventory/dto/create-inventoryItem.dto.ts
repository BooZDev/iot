import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'Mã sản phẩm trong kho' })
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  @IsString({ message: 'Mã sản phẩm không hợp lệ' })
  productId: string;

  @ApiProperty({ description: 'Mã kho chứa sản phẩm' })
  @IsNotEmpty({ message: 'Mã kho không được để trống' })
  @IsString({ message: 'Mã kho không hợp lệ' })
  warehouseId: string;

  @ApiProperty({ description: 'Số lượng sản phẩm trong kho' })
  @IsNotEmpty({ message: 'Số lượng sản phẩm không được để trống' })
  @IsNumber({}, { message: 'Số lượng sản phẩm không hợp lệ' })
  quantity?: number;

  @ApiProperty({ description: 'Thời gian sản phẩm vào kho lần cuối' })
  @IsNotEmpty({ message: 'Thời gian vào kho không được để trống' })
  @IsString({ message: 'Thời gian vào kho không hợp lệ' })
  lastInAt?: Date;

  @ApiProperty({ description: 'Thời gian sản phẩm ra kho lần cuối' })
  @IsNotEmpty({ message: 'Thời gian ra kho không được để trống' })
  @IsString({ message: 'Thời gian ra kho không hợp lệ' })
  lastOutAt?: Date;
}
