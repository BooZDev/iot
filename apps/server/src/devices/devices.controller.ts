import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.devicesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateDeviceDto: Partial<CreateDeviceDto>,
  ) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Put('remove/:id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.devicesService.remove(id);
  }
}
