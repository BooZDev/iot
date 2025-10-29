import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: Types.ObjectId) {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Types.ObjectId) {
    return this.userService.delete(id);
  }
}
