import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateDeviceDto } from './dto/update-device.dto';

@ApiTags('devices')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // Create Device
  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Post()
  @ApiOperation({
    summary: 'Tạo thiết bị mới',
    description:
      'Cần quyền admin, manager và engineer để thực hiện hành động này',
  })
  @ApiBody({ type: CreateDeviceDto })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  // Get All Devices
  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả thiết bị',
    description:
      'Cần quyền admin, manager và engineer để thực hiện hành động này',
  })
  findAll() {
    return this.devicesService.findAll();
  }

  // Get Device by ID
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin thiết bị theo ID',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của thiết bị' })
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  // Update Device
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin thiết bị',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của thiết bị' })
  @ApiBody({ type: UpdateDeviceDto })
  async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return await this.devicesService.update(id, updateDeviceDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thiết bị',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của thiết bị' })
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }
}
