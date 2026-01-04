import { IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  level: string;

  @IsString()
  reason: string;

  @IsNumber()
  value: number;

  @IsString()
  status: string;

  @IsString()
  warehouseId: string;
}
