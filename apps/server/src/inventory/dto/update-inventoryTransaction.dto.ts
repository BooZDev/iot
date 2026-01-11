import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateInventoryTransactionDto {
  @ApiProperty({ description: 'Loại giao dịch (IN hoặc OUT)' })
  @IsNotEmpty({ message: 'Loại giao dịch không được để trống' })
  @IsString({ message: 'Loại giao dịch không hợp lệ' })
  status: string;
}
