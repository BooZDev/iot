import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ControlPacketDto {
  @ApiProperty({ description: 'Loại lệnh điều khiển' })
  @IsOptional()
  @IsNumber()
  kind: number = 0;

  @ApiProperty({ description: 'Loại thiết bị' })
  @IsOptional()
  @IsNumber()
  actuator: number = 0;

  @ApiProperty({ description: 'Trạng thái bật/tắt' })
  @IsOptional()
  @IsNumber()
  on: number = 0;

  @ApiProperty({ description: 'Giá trị điều khiển' })
  @IsOptional()
  @IsNumber()
  value: number = 0;

  @IsOptional()
  @IsNumber()
  ttl_ms: number = 30000;
}
