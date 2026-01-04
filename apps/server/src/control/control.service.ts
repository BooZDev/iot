import { Injectable, NotFoundException } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';
import { ControlPacketDto } from 'src/control/dto/controlPacket.dto';
import { MqttService } from 'src/mqtt/mqtt.service';
import { SubDevicesService } from 'src/sub-devices/sub-devices.service';
import { ThresholdPacketDto } from './dto/thresholdPacket.dto';

@Injectable()
export class ControlService {
  constructor(
    private readonly mqttSevice: MqttService,
    private readonly subDevicesService: SubDevicesService,
    private readonly devicesService: DevicesService,
  ) {}

  async sendControlCommand(
    deviceId: string,
    packet: Partial<ControlPacketDto>,
  ) {
    const subDevice = await this.subDevicesService.findOne(deviceId);

    if (!subDevice) {
      throw new NotFoundException('Không tìm thấy thiết bị với ID đã cho');
    }
    const topic = `warehouse/gtw_${subDevice.deviceId.gatewayId.mac}/node_${subDevice.deviceId.mac}/device/cmd`;

    this.mqttSevice.publicToTopic(topic, packet);

    return { message: `${topic} ${JSON.stringify(packet)}` };
  }

  async setWarningThreshold(
    deviceId: string,
    threshold: Partial<ThresholdPacketDto>,
  ) {
    const device = await this.devicesService.findOne(deviceId);

    if (!device) {
      throw new NotFoundException('Không tìm thấy thiết bị với ID đã cho');
    }
    const topic = `warehouse/gtw_${device.gatewayId.mac}/node_${device.mac}/control/threshold/cmd`;

    this.mqttSevice.publicToTopic(topic, {
      ...threshold,
    });

    return { message: 'Đã gửi lệnh thiết lập ngưỡng cảnh báo thành công' };
  }

  async setRfidUserInfo(userId: string, rfidTag: string) {
    const device = await this.devicesService.findOne(rfidTag);

    if (!device) {
      throw new NotFoundException('Không tìm thấy thiết bị với ID đã cho');
    }
    const topic = `warehouse/gtw_${device.gatewayId.mac}/node_${device.mac}/control/rfid/user-infi/cmd`;

    this.mqttSevice.publicToTopic(topic, {
      userId: userId,
    });

    return { message: 'Đã gửi lệnh thiết lập thông tin người dùng thành công' };
  }

  async setRfidProductInfo(productId: string, rfidTag: string) {
    // Implementation for setting RFID product info can be added here
    return await Promise.resolve({
      message:
        'Chức năng thiết lập thông tin sản phẩm RFID chưa được triển khai',
    });
  }
}
