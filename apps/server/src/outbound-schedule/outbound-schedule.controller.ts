import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OutboundScheduleService } from './outbound-schedule.service';
import { CreateOutboundScheduleDto } from './dto/create-outbound-schedule.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Outbound Schedule')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('outbound-schedule')
export class OutboundScheduleController {
  constructor(
    private readonly outboundScheduleService: OutboundScheduleService,
  ) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Tạo lịch xuất kho mới',
    description: 'Tạo một lịch xuất kho mới cho kho hàng',
  })
  @ApiBody({ type: CreateOutboundScheduleDto })
  @Post()
  create(@Body() createOutboundScheduleDto: CreateOutboundScheduleDto) {
    return this.outboundScheduleService.create(createOutboundScheduleDto);
  }

  @ApiOperation({
    summary: 'Lấy tất cả lịch xuất kho',
    description: 'Lấy danh sách tất cả lịch xuất kho',
  })
  @Get()
  findAll() {
    return this.outboundScheduleService.findAll();
  }

  @ApiOperation({
    summary: 'Lấy tất cả lịch xuất kho theo ID nhà kho',
    description: 'Lấy danh sách tất cả lịch xuất kho cho một nhà kho cụ thể',
  })
  @ApiParam({
    name: 'warehouseId',
    type: String,
    description: 'ID của nhà kho',
  })
  @Get('warehouse/:warehouseId')
  findAllByWarehouseId(@Param('warehouseId') warehouseId: string) {
    return this.outboundScheduleService.findAllByWarehouseId(warehouseId);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Xóa lịch xuất kho',
    description: 'Xóa một lịch xuất kho theo ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của lịch xuất kho cần xóa',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outboundScheduleService.remove(id);
  }
}
