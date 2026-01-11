import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateInventoryTransactionDto {
  @ApiProperty({ description: 'Mã sản phẩm' })
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  @IsString({ message: 'Mã sản phẩm không hợp lệ' })
  productId: string;

  @ApiProperty({ description: 'Mã kho' })
  @IsNotEmpty({ message: 'Mã kho không được để trống' })
  @IsString({ message: 'Mã kho không hợp lệ' })
  warehouseId: string;

  @ApiProperty({ description: 'Số lượng giao dịch' })
  @IsNotEmpty({ message: 'Số lượng giao dịch không được để trống' })
  quantity: number;

  @ApiProperty({ description: 'Loại giao dịch (IN hoặc OUT)' })
  @IsOptional()
  @IsString({ message: 'Loại giao dịch không hợp lệ' })
  transactionType?: string;

  @ApiProperty({ description: 'Mã người thực hiện giao dịch' })
  @IsNotEmpty({ message: 'Mã người thực hiện giao dịch không được để trống' })
  @IsString({ message: 'Mã người thực hiện giao dịch không hợp lệ' })
  operatorId: string;

  @ApiProperty({ description: 'Mã thẻ RFID (nếu có)', required: false })
  @IsString({ message: 'Mã thẻ RFID không hợp lệ' })
  @IsNotEmpty({ message: 'Mã thẻ RFID không được để trống' })
  rfidTagId: string;

  @ApiProperty({ description: 'Thời gian yêu cầu giao dịch', required: false })
  @IsOptional()
  requestTime?: Date;
}
