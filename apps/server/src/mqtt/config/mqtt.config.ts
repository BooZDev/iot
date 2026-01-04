import { MqttOptions, Transport } from '@nestjs/microservices';

export const mqttConfig: MqttOptions & { name: string } = {
  transport: Transport.MQTT,
  name: 'MQTT_SERVICE',
  options: {
    url: process.env.MQTT_ULR,
    // username: process.env.MQTT_USERNAME,
    // password: process.env.MQTT_PASSWORD,
    clientId: process.env.MQTT_CLIENT_ID_2 || 'server-pub',
    rejectUnauthorized: false,
    keepalive: 60,
    reconnectPeriod: 3000,
  },
};
