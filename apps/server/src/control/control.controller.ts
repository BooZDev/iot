import { Body, Controller, Param, Post } from '@nestjs/common';
import { ControlService } from './control.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post(':subDeviceId/value')
  @ApiOperation({
    summary: 'Điều khiển tốc độ quạt của thiết bị con',
    description: 'Gửi lệnh điều khiển tốc độ quạt cho thiết bị con qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number', example: 50 },
      },
      required: ['value'],
    },
  })
  @ApiParam({
    name: 'subDeviceId',
    type: String,
    description: 'ID của thiết bị con',
  })
  async controlFan(
    @Body()
    body: {
      value: number;
    },
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.controlFanSpeed(deviceId, body.value);
  }

  @Post(':subDeviceId/state')
  @ApiOperation({
    summary: 'Điều khiển trạng thái quạt của thiết bị con',
    description:
      'Gửi lệnh điều khiển trạng thái quạt cho thiết bị con qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        state: { type: 'string', example: 'ON' },
      },
      required: ['state'],
    },
  })
  @ApiParam({
    name: 'subDeviceId',
    type: String,
    description: 'ID của thiết bị con',
  })
  async controlState(
    @Body()
    body: {
      state: string;
    },
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.controlState(deviceId, body.state);
  }

  @Post(':subDeviceId/status')
  @ApiOperation({
    summary: 'Điều khiển trạng thái thiết bị con',
    description: 'Gửi lệnh điều khiển trạng thái thiết bị con qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ACTIVE' },
      },
      required: ['status'],
    },
  })
  @ApiParam({
    name: 'subDeviceId',
    type: String,
    description: 'ID của thiết bị con',
  })
  async controlStatus(
    @Body()
    body: {
      status: string;
    },
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.controlStatus(deviceId, body.status);
  }

  @Post(':deviceId/threshold')
  @ApiOperation({
    summary: 'Thiết lập ngưỡng cảnh báo cho thiết bị',
    description: 'Gửi lệnh thiết lập ngưỡng cảnh báo cho thiết bị qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        threshold: {
          type: 'object',
          properties: {
            min: { type: 'number', example: 10 },
            max: { type: 'number', example: 80 },
          },
        },
        type: { type: 'string', example: 'temperature' },
      },
      required: ['threshold', 'type'],
    },
  })
  @ApiParam({
    name: 'deviceId',
    type: String,
    description: 'ID của thiết bị',
  })
  async setWarningThreshold(
    @Body()
    body: {
      threshold: {
        min: number;
        max: number;
      };
      type: string;
    },
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.setWarningThreshold(
      deviceId,
      body.threshold,
      body.type,
    );
  }

  @Post('rfid/user/:userId')
  @ApiOperation({
    summary: 'Gửi thông tin người dùng đến thiết bị RFID',
    description:
      'Gửi lệnh thiết lập thông tin người dùng cho thiết bị RFID qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rfidTag: { type: 'string', example: 'RFID123456' },
      },
      required: ['rfidTag'],
    },
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID của người dùng',
  })
  async setRfidUserInfo(
    @Param('userId') userId: string,
    @Body() body: { rfidTag: string },
  ) {
    return this.controlService.setRfidUserInfo(userId, body.rfidTag);
  }

  @Post('rfid/product/:productId')
  @ApiOperation({
    summary: 'Gửi thông tin sản phẩm đến thiết bị RFID',
    description:
      'Gửi lệnh thiết lập thông tin sản phẩm cho thiết bị RFID qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rfidTag: { type: 'string', example: 'RFID654321' },
      },
      required: ['rfidTag'],
    },
  })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID của sản phẩm',
  })
  async setRfidProductInfo(
    @Param('productId') productId: string,
    @Body() body: { rfidTag: string },
  ) {
    return this.controlService.setRfidProductInfo(productId, body.rfidTag);
  }
}
