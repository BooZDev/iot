import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { mqttConfig } from './config/mqtt.config';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(@Inject(mqttConfig.name) private readonly client: ClientProxy) {}

  onModuleInit() {
    this.client.connect().catch((err) => {
      console.error('Error connecting to MQTT broker:', err);
    });
  }

  publicToTopic(topic: string, message: any = {}) {
    return this.client.emit(topic, message);
  }
}
