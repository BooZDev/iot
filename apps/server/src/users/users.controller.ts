import {
  Controller,
  Get,
  Body,
  Delete,
  Put,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Get('all')
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description: 'Cần quyền admin để thực hiện hành động này',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ người dùng hiện tại',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  getProfile(@Req() req: { user: { id: string } }) {
    return this.userService.findById(req.user.id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RoleGuard)
  @Get(':id/profile')
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ người dùng theo ID',
    description: 'Cần quyền admin để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của người dùng' })
  getUserProfile(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Cập nhật thông tin hồ sơ người dùng hiện tại',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Req() req: { user: { id: string } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Patch('repassword')
  @ApiOperation({
    summary: 'Đổi mật khẩu người dùng hiện tại',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiBody({ type: String, description: 'Mật khẩu mới' })
  rePassword(
    @Req() req: { user: { id: string } },
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.rePassword(req.user.id, newPassword);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RoleGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng theo ID',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của người dùng' })
  @ApiBody({ type: UpdateUserDto })
  updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Xóa người dùng hiện tại',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  delete(@Req() req: { user: { id: string } }) {
    return this.userService.delete(req.user.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa người dùng theo ID',
    description: 'Cần quyền admin để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của người dùng' })
  deleteById(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
