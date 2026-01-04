import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productCode: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  warehouseId: string;
}
