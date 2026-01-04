import { Controller, Get, Param } from '@nestjs/common';
import { ThresholdService } from './threshold.service';

@Controller('threshold')
export class ThresholdController {
  constructor(private readonly thresholdService: ThresholdService) {}

  @Get()
  findAll() {
    return this.thresholdService.findAll();
  }

  @Get(':warehouseId')
  findOne(@Param('warehouseId') warehouseId: string) {
    return this.thresholdService.findOne(warehouseId);
  }
}
