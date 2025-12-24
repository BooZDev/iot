import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubDevicesService } from './sub-devices.service';
import { CreateSubDeviceDto } from './dto/create-sub-device.dto';
import { UpdateSubDeviceDto } from './dto/update-sub-device.dto';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('sub-devices')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('sub-devices')
export class SubDevicesController {
  constructor(private readonly subDevicesService: SubDevicesService) {}

  // Create Sub-Device
  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Post()
  @ApiOperation({
    summary: 'Tạo thiết bị con mới',
    description:
      'Cần quyền admin, manager và engineer để thực hiện hành động này',
  })
  @ApiBody({ type: CreateSubDeviceDto })
  create(@Body() createSubDeviceDto: CreateSubDeviceDto) {
    return this.subDevicesService.create(createSubDeviceDto);
  }

  // Get All Sub-Devices
  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả thiết bị con',
    description:
      'Cần quyền admin, manager và engineer để thực hiện hành động này',
  })
  findAll() {
    return this.subDevicesService.findAll();
  }

  // Get Sub-Devices by Device ID
  @Get('device/:deviceId')
  findAllByDeviceId(@Param('deviceId') deviceId: string) {
    return this.subDevicesService.findAllByDeviceId(deviceId);
  }

  // Get Sub-Devices by Warehouse ID
  @Get('warehouse/:warehouseId')
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị con theo ID kho',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiParam({ name: 'warehouseId', type: String, description: 'ID của kho' })
  finAllByWarehouseId(@Param('warehouseId') warehouseId: string) {
    return this.subDevicesService.finAllByWarehouseId(warehouseId);
  }

  // Update Sub-Device
  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin thiết bị con',
    description:
      'Cần quyền admin, manager và engineer để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của thiết bị con' })
  @ApiBody({ type: UpdateSubDeviceDto })
  update(
    @Param('id') id: string,
    @Body() updateSubDeviceDto: UpdateSubDeviceDto,
  ) {
    return this.subDevicesService.update(id, updateSubDeviceDto);
  }

  // Delete Sub-Device
  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thiết bị con',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của thiết bị con' })
  remove(@Param('id') id: string) {
    return this.subDevicesService.remove(id);
  }
}
