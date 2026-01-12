import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.client = mqtt.connect('mqtt://broker.emqx.io:1883', {
      clientId: 'nestjs-backend-001',
      clean: false, // ✅ giữ session
      reconnectPeriod: 2000,
    });

    this.client.on('connect', () => {
      console.log('✅ MQTT connected');
    });

    this.client.on('reconnect', () => {
      console.log('🔁 MQTT reconnecting...');
    });

    this.client.on('offline', () => {
      console.log('⚠️ MQTT offline');
    });

    this.client.on('error', console.error);
  }

  publicToTopic(topic: string, payload: any) {
    this.client.publish(topic, JSON.stringify(payload), {
      qos: 1,
      retain: true,
    });
  }
}
