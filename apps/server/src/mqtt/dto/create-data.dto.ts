import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateDataDto {
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsNotEmpty()
  metadata: {
    deviceId: string;
    location: string;
  };

  @IsNotEmpty()
  temperature: number;

  @IsNotEmpty()
  humidity: number;

  @IsNotEmpty()
  gas: number;

  @IsNotEmpty()
  lux: number;
}
