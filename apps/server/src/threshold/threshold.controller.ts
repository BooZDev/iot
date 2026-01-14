import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
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
