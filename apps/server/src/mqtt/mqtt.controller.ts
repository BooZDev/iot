import { Controller } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { DataType } from './types/data.type';
import { DevicesService } from 'src/devices/devices.service';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';
import { RealtimeService } from 'src/realtime/realtime.service';

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly dataService: DataService,
    private readonly devicesService: DevicesService,
    private readonly wsGateway: RealtimeGateway,
    private readonly realtimeService: RealtimeService,
  ) {}

  @EventPattern('warehouse/+/+/data/sensor')
  async handleMqttMessage(
    @Ctx() context: MqttContext,
    @Payload()
    message: {
      temp: number;
      hum: number;
      gasLever: number;
      lightCurrent: number;
    },
  ) {
    console.log('Received MQTT message:', message);
    const topic = context.getTopic().split('/');
    const warehouseMac = topic[1].slice(4);
    const deviceMac = topic[2].slice(5);

    this.realtimeService.setLastMessage('environmentalData', message);
    this.wsGateway.server.to(`wh:1111`).emit('environmentalData', message);

    const device = await this.devicesService.findByMac(deviceMac);

    if (!device) {
      console.error('Device not found for node mac:', deviceMac);
      return;
    }

    // vn timezone
    const timestamp = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const metadata = device._id;

    const data: DataType = {
      temp: message.temp,
      hum: message.hum,
      gasLever: message.gasLever,
      lightCurrent: message.lightCurrent,
    };

    const createDataDto: CreateDataDto = {
      timestamp,
      metadata,
      data,
    };

    await this.dataService.create(createDataDto);
  }

  // @EventPattern('warehouse/+/+/alert/sensor')
  // async handleAlertMessage(
  //   @Payload() data: { alertType: string; alertValue: number },
  //   @Ctx() context: MqttContext,
  // ) {
  //   const topic = context.getTopic();
  // }
}
