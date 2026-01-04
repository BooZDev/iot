import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Mã người dùng' })
  @IsOptional()
  @IsString({ message: 'Mã người dùng không hợp lệ' })
  code?: string;

  @ApiProperty({ description: 'Tên tài khoản người dùng' })
  @IsOptional()
  @IsString({ message: 'Tên tài khoản không hợp lệ' })
  username?: string;

  @ApiProperty({ description: 'Email người dùng' })
  @IsOptional()
  @IsString({ message: 'Email không hợp lệ' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({ description: 'Ngày sinh người dùng' })
  @IsOptional()
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Họ và tên người dùng' })
  @IsOptional()
  @IsString({ message: 'Họ và tên không hợp lệ' })
  fullName?: string;

  @ApiProperty({ description: 'URL ảnh đại diện người dùng' })
  @IsOptional()
  @IsUrl({}, { message: 'URL ảnh đại diện không hợp lệ' })
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
