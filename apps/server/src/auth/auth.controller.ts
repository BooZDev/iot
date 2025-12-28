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
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from './enums/role.enum';
import { RoleGuard } from './guards/role/role.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@ApiBearerAuth('refresh-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register User
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký người dùng mới',
    description: 'Cần quyền admin để thực hiện hành động này',
  })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // Login User
  @UseGuards(LocalAuthGuard)
  @HttpCode(201)
  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập người dùng',
    description:
      'Cung cấp thông tin đăng nhập hợp lệ để thực hiện hành động này',
  })
  @ApiBody({ type: LoginDto })
  login(@Req() req: { user: { id: string } }) {
    return this.authService.login(req.user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(201)
  @Post('refresh')
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Cần cung cấp refresh token hợp lệ để thực hiện hành động này',
  })
  refreshToken(@Req() req: { user: { id: string } }) {
    return this.authService.refreshTokens(req.user.id);
  }
}
