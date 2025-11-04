import {
  Controller,
  Get,
  Body,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  getProfile(@Req() req: { user: { id: Types.ObjectId } }) {
    return this.userService.findById(req.user.id);
  }

  @Put()
  update(
    @Req() req: { user: { id: Types.ObjectId } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  delete(@Req() req: { user: { id: Types.ObjectId } }) {
    return this.userService.delete(req.user.id);
  }

  @Delete('":id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  deleteById(@Body('id') id: Types.ObjectId) {
    return this.userService.delete(id);
  }
}
