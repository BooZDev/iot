import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';
import { Types } from 'mongoose';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Data')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('hourly-avg-last-24h/:deviceId')
  @ApiOperation({
    summary: 'Lấy giá trị trung bình theo giờ trong 24 giờ qua cho thiết bị',
    description: 'Trả về mảng các giá trị trung bình theo giờ trong 24 giờ qua',
  })
  @ApiParam({
    name: 'deviceId',
    type: String,
    description: 'ID của thiết bị',
  })
  async getHourlyAvgLast24h(@Param('deviceId') deviceId: string) {
    return await this.dataService.getHourlyAvgLast24h(
      new Types.ObjectId(deviceId),
    );
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Lấy dữ liệu mới nhất',
    description: 'Trả về dữ liệu mới nhất trong hệ thống',
  })
  async getLatestData(warehouseId: string) {
    return await this.dataService.findOne(warehouseId);
  }
}
