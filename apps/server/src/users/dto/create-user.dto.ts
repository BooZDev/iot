import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Length,
  IsNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Mã người dùng' })
  @IsNotEmpty({ message: 'Mã người dùng không được để trống' })
  @IsString({ message: 'Mã người dùng không hợp lệ' })
  code: string;

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

  @ApiProperty({ description: 'Họ và tên người dùng' })
  @IsOptional()
  @IsString({ message: 'Họ và tên không hợp lệ' })
  fullName?: string;

  @ApiProperty({ description: 'Ngày sinh người dùng' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'URL ảnh đại diện người dùng' })
  @IsOptional()
  @IsString({ message: 'URL ảnh đại diện không hợp lệ' })
  avatarUrl?: string;

  @ApiProperty({ description: 'Vai trò người dùng' })
  @IsOptional()
  @IsArray({ message: 'Vai trò không hợp lệ' })
  @Type(() => String)
  @IsEnum(Role, {
    each: true,
    message: 'Vai trò phải là admin, manager, engineeer hoặc staff',
  })
  role?: Role[];

  @ApiProperty({ description: 'ID kho của người dùng' })
  @IsOptional()
  @IsMongoId({ message: 'warehouseId không hợp lệ' })
  warehouseId?: Types.ObjectId;
}
