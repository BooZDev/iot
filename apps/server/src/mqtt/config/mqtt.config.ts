import { MqttOptions, Transport } from '@nestjs/microservices';

export const mqttConfig: MqttOptions & { name: string } = {
  transport: Transport.MQTT,
  name: 'MQTT_SERVICE',
  options: {
    url: process.env.MQTT_ULR,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: 'server_publisher',
    reconnectPeriod: 3000,
  },
};
