import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOutboundScheduleDto {
  @ApiProperty({ description: 'ID sản phẩm cần xuất kho' })
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsString({ message: 'ID sản phẩm không hợp lệ' })
  productId: string;

  @ApiProperty({ description: 'ID kho xuất hàng' })
  @IsNotEmpty({ message: 'ID kho không được để trống' })
  @IsString({ message: 'ID kho không hợp lệ' })
  warehouseId: string;

  @ApiProperty({ description: 'Thời gian bắt đầu xuất kho' })
  @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
  startAt: Date;

  @ApiProperty({ description: 'Thời gian kết thúc xuất kho' })
  @IsNotEmpty({ message: 'Thời gian kết thúc không được để trống' })
  endAt: Date;

  @ApiProperty({ description: 'Người tạo lịch xuất kho' })
  @IsNotEmpty({ message: 'Người tạo lịch xuất kho không được để trống' })
  @IsString({ message: 'createdBy không hợp lệ' })
  createdBy: string;
}
