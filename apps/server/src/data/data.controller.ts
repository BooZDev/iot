import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Data')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('hourly-avg-last-24h/:warehouseId')
  @ApiOperation({
    summary: 'Lấy giá trị trung bình theo giờ trong 24 giờ qua cho kho',
    description: 'Trả về mảng các giá trị trung bình theo giờ trong 24 giờ qua',
  })
  @ApiParam({
    name: 'warehouseId',
    type: String,
    description: 'ID của kho',
  })
  async getHourlyAvgLast24h(@Param('warehouseId') warehouseId: string) {
    return await this.dataService.getHourlyAvgLast24h(warehouseId);
  }

  @Get('/:warehouseId/latest')
  @ApiOperation({
    summary: 'Lấy dữ liệu mới nhất',
    description: 'Trả về dữ liệu mới nhất trong hệ thống',
  })
  @ApiParam({
    name: 'warehouseId',
    type: String,
    description: 'ID của kho',
  })
  async getLatestData(@Param('warehouseId') warehouseId: string) {
    return await this.dataService.findOne(warehouseId);
  }
}
