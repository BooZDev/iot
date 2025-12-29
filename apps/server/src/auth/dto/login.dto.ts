import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'huyen@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  password: string;
}
