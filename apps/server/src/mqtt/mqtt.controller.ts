import { Controller } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { EventPattern } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { CreateDataDto } from './dto/create-data.dto';

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly dataService: DataService,
  ) {}

  @EventPattern('warehouse/1/data')
  async handleMqttMessage(data: {
    id: number;
    temp: number;
    hum: number;
    gasValue: number;
    luxValue: number;
  }) {
    console.log('Received MQTT message:', data);

    const timestamp = new Date();
    const metadata = {
      deviceId: data.id.toString(),
      location: 'warehouse 1',
    };
    const createDataDto: CreateDataDto = {
      timestamp,
      metadata,
      temperature: data.temp,
      humidity: data.hum,
      gas: data.gasValue,
      lux: data.luxValue,
    };

    await this.dataService.create(createDataDto);
  }
}
