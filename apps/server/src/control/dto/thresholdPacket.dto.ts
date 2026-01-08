import { IsNumber, IsOptional } from 'class-validator';

export class ThresholdPacketDto {
  @IsOptional()
  @IsNumber()
  temp_lo: number = -99;

  @IsOptional()
  @IsNumber()
  temp_hi: number = 200;

  @IsOptional()
  @IsNumber()
  hum_lo: number = -1;

  @IsOptional()
  @IsNumber()
  hum_hi: number = 101;

  @IsOptional()
  @IsNumber()
  gas_hi: number = 1000;

  @IsOptional()
  @IsNumber()
  light_lo: number = -100;

  @IsOptional()
  @IsNumber()
  light_hi: number = 3000;
}
