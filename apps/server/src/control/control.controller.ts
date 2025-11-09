import { Body, Controller, Param, Post } from '@nestjs/common';
import { ControlService } from './control.service';
import { MqttService } from 'src/mqtt/mqtt.service';

@Controller()
export class ControlController {
  constructor(
    private readonly controlService: ControlService,
    private readonly mqttSevice: MqttService,
  ) {}

  @Post('fan')
  controlFan(
    @Body()
    body: {
      id: string;
      type: string;
      status: string;
      state: string;
      value: number;
    },
    @Param() param: { mac: string; deviceMac: string },
  ) {
    this.mqttSevice.publicToTopic(
      `warehouse/${param.mac}/cmd/control/device`,
      body,
    );

    return { message: 'Fan control command sent successfully' };
  }
}
