import { IsString } from 'class-validator';

export class UpdateWarehouseDto {
  @IsString()
  name?: string;

  @IsString()
  type?: string;

  location?: [number, number];
}
