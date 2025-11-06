import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Types } from 'mongoose';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from './enums/role.enum';
import { RoleGuard } from './guards/role/role.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(201)
  @Post('login')
  login(@Req() req: { user: { id: Types.ObjectId } }) {
    return this.authService.login(req.user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(201)
  @Post('refresh')
  refreshToken(@Req() req: { user: { id: Types.ObjectId } }) {
    return this.authService.refreshTokens(req.user.id);
  }
}
