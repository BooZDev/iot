import { Body, Controller, Param, Post } from '@nestjs/common';
import { ControlService } from './control.service';
import { MqttService } from 'src/mqtt/mqtt.service';

@Controller()
export class ControlController {
  constructor(
    private readonly controlService: ControlService,
    private readonly mqttSevice: MqttService,
  ) {}

  @Post()
  controlFan(
    @Body() body: { device: string; status: string; value: number },
    @Param() param: { mac: string; deviceMac: string },
  ) {
    this.mqttSevice.publicToTopic(
      `warehouse/${param.mac}/cmd/${param.deviceMac}`,
      body,
    );

    return { message: 'Fan control command sent successfully' };
  }
}
