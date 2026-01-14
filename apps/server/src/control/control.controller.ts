import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ControlService } from './control.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ControlPacketDto } from 'src/control/dto/controlPacket.dto';
import { ThresholdPacketDto } from './dto/thresholdPacket.dto';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Control')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Post(':deviceId')
  @ApiOperation({
    summary: 'Gửi lệnh điều khiển đến thiết bị',
    description: 'Gửi lệnh điều khiển cho thiết bị qua MQTT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        kind: { type: 'number', example: 1 },
        actuator: { type: 'number', example: 2 },
        on: { type: 'number', example: 1 },
        value: { type: 'number', example: 50 },
      },
    },
  })
  @ApiParam({
    name: 'deviceId',
    type: String,
    description: 'ID của thiết bị',
  })
  async sendControlCommand(
    @Body()
    body: ControlPacketDto,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.sendControlCommand(deviceId, body);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.ENGINEER)
  @Post(':deviceId/threshold')
  @ApiOperation({
    summary: 'Thiết lập ngưỡng cảnh báo cho thiết bị',
    description: 'Gửi lệnh thiết lập ngưỡng cảnh báo cho thiết bị qua MQTT',
  })
  @ApiBody({
    type: ThresholdPacketDto,
  })
  @ApiParam({
    name: 'deviceId',
    type: String,
    description: 'ID của thiết bị',
  })
  async setWarningThreshold(
    @Body()
    body: ThresholdPacketDto,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.controlService.setWarningThreshold(deviceId, body);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
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
}
