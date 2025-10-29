import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  login(userId: Types.ObjectId) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
