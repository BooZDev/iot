import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DevicesService } from 'src/devices/devices.service';
import { SubDevicesService } from 'src/sub-devices/sub-devices.service';

@ApiTags('warehouses')
@Roles(Role.ADMIN, Role.MANAGER)
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly warehousesService: WarehousesService,
    private readonly devicesService: DevicesService,
    private readonly subDevicesService: SubDevicesService,
  ) {}

  // Create Warehouse
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  @ApiOperation({
    summary: 'Tạo nhà kho mới',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiBody({ type: CreateWarehouseDto })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    console.log('Create Warehouse DTO:', createWarehouseDto);
    return this.warehousesService.create(createWarehouseDto);
  }

  // Get All Warehouses
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả nhà kho',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  findAll() {
    return this.warehousesService.findAll();
  }

  // Get Warehouse by ID
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin nhà kho theo ID',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  // Get Devices by Warehouse ID
  @Get(':id/devices')
  @ApiOperation({
    summary: 'Lấy danh sách thiết bị trong nhà kho theo ID nhà kho',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  async getDevicesByWarehouseId(@Param('id') warehouseId: string) {
    return this.devicesService.findAllByWarehouseId(warehouseId);
  }

  // Get Sub-Devices by Warehouse ID
  @Get(':id/sub-devices')
  @ApiOperation({
    summary: 'Lấy danh sách thiết bị con trong nhà kho theo ID nhà kho',
    description: 'Tất cả vai trò đều có thể thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  async getSubDevicesByWarehouseId(@Param('id') warehouseId: string) {
    return this.subDevicesService.finAllByWarehouseId(warehouseId);
  }

  // Update Warehouse
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin nhà kho',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  // Deactivate Warehouse
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch('deactivate/:id')
  @ApiOperation({
    summary: 'Hủy kích hoạt nhà kho',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  deactivateWarehouse(@Param('id') warehouseId: string) {
    return this.warehousesService.deactivateWarehouse(warehouseId);
  }

  // Delete Warehouse
  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa nhà kho',
    description: 'Cần quyền admin và manager để thực hiện hành động này',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID của nhà kho' })
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
