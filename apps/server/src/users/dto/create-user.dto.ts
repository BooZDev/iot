import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Tên tài khoản cần nhiều hơn 8 ký tự và ít hơn 20 ký tự',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30, {
    message: 'Mật khẩu phải nhiều hơn 8 ký tự và ít hơn 30 ký tự.',
  })
  password: string;
}
