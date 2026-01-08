import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }

  @Get(':warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.alertService.findByWarehouse(warehouseId);
  }

  findAll() {
    return this.alertService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertService.update(id, updateAlertDto);
  }
}
