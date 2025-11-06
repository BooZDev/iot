import { IsString } from 'class-validator';

export class UpdateDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  location: string;

  @IsString()
  type: string;

  @IsString()
  status: string;
}
