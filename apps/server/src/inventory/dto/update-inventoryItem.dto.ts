import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateInventoryItemDto {
  @ApiProperty({ description: 'Số lượng sản phẩm trong kho', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Số lượng sản phẩm không hợp lệ' })
  quantity?: number;

  @ApiProperty({
    description: 'Thời gian sản phẩm vào kho lần cuối',
    required: false,
  })
  @IsOptional()
  lastInAt?: Date;

  @ApiProperty({
    description: 'Thời gian sản phẩm ra kho lần cuối',
    required: false,
  })
  @IsOptional()
  lastOutAt?: Date;
}
