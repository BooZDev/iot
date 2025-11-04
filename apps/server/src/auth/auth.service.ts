import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from './types/current-user';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');

    return { id: user._id };
  }

  async register(createAuthDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createAuthDto.email);

    if (user) {
      throw new ForbiddenException(
        'Email đã được sử dụng. Vui lòng chọn email khác.',
      );
    }

    return await this.userService.create(createAuthDto);
  }

  async login(userId: Types.ObjectId) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async generateTokens(userId: Types.ObjectId) {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: Types.ObjectId) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async validateJwtUser(id: Types.ObjectId) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại.');
    }

    const userCurrent: CurrentUser = { id: user._id, role: user.role };

    return userCurrent;
  }

  async validateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại.');
    }

    const isRefreshTokenMatch = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!isRefreshTokenMatch) {
      throw new ForbiddenException('Truy cập bị từ chối.');
    }

    return { id: user._id };
  }
}
