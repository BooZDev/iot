import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Tên tài khoản người dùng' })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @IsString({ message: 'Tên tài khoản không hợp lệ' })
  @Length(8, 20, {
    message: 'Tên tài khoản cần nhiều hơn 8 ký tự và ít hơn 20 ký tự',
  })
  username: string;

  @ApiProperty({ description: 'Email người dùng' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @IsString()
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu người dùng' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @IsString({ message: 'Mật khẩu không hợp lệ.' })
  @Length(8, 30, {
    message: 'Mật khẩu phải nhiều hơn 8 ký tự và ít hơn 30 ký tự.',
  })
  password: string;
}
