import { Controller } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { EventPattern } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { DataType } from './types/data.type';
import { DevicesService } from 'src/devices/devices.service';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly dataService: DataService,
    private readonly devicesService: DevicesService,
    private readonly wsGateway: RealtimeGateway,
  ) {}

  @EventPattern('warehouse/+/data/+')
  async handleMqttMessage(message: {
    id: string;
    nodeId: string;
    readingId: number;
    temp: number;
    hum: number;
    gasValue: number;
    luxValue: number;
  }) {
    console.log('Received MQTT message:', message);

    this.wsGateway.server.emit('message', message);

    const device = await this.devicesService.findbyDeviceId(message.nodeId);

    if (!device) {
      console.error('Device not found for nodeId:', message.nodeId);
      return;
    }

    const timestamp = new Date();
    const metadata = device._id;

    const data: DataType = {
      readingId: message.readingId.toString(),
      temperature: message.temp,
      humidity: message.hum,
      gas: message.gasValue,
      lux: message.luxValue,
    };

    const createDataDto: CreateDataDto = {
      timestamp,
      metadata,
      data,
    };

    await this.dataService.create(createDataDto);
  }
}
