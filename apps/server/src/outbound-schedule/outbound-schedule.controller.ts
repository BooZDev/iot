import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OutboundScheduleService } from './outbound-schedule.service';
import { CreateOutboundScheduleDto } from './dto/create-outbound-schedule.dto';

@Controller('outbound-schedule')
export class OutboundScheduleController {
  constructor(
    private readonly outboundScheduleService: OutboundScheduleService,
  ) {}

  @Post()
  create(@Body() createOutboundScheduleDto: CreateOutboundScheduleDto) {
    return this.outboundScheduleService.create(createOutboundScheduleDto);
  }

  @Get()
  findAll() {
    return this.outboundScheduleService.findAll();
  }

  @Get('warehouse/:warehouseId')
  findAllByWarehouseId(@Param('warehouseId') warehouseId: string) {
    return this.outboundScheduleService.findAllByWarehouseId(warehouseId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outboundScheduleService.remove(id);
  }
}
