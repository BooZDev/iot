import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'anh@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  password: string;
}
