import { Injectable, NotFoundException } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';
import { MqttService } from 'src/mqtt/mqtt.service';
import { SubDevicesService } from 'src/sub-devices/sub-devices.service';

@Injectable()
export class ControlService {
  constructor(
    private readonly mqttSevice: MqttService,
    private readonly subDevicesService: SubDevicesService,
    private readonly devicesService: DevicesService,
  ) {}

  async controlFanSpeed(subDeviceId: string, value: number) {
    const subDevice = await this.subDevicesService.findOne(subDeviceId);

    if (!subDevice) {
      throw new NotFoundException('Không tìm thấy thiết bị con với ID đã cho');
    }

    const topic = `warehouse/gateway_${subDevice.deviceId.gatewayId.mac}/node_${subDevice.deviceId.mac}/control/fan/speed/cmd`;

    this.mqttSevice.publicToTopic(topic, {
      value: value,
    });

    return { message: 'Đã gửi lệnh điều khiển tốc độ quạt thành công' };
  }

  async controlState(subDeviceId: string, state: string) {
    const subDevice = await this.subDevicesService.findOne(subDeviceId);

    if (!subDevice) {
      throw new NotFoundException('Không tìm thấy thiết bị con với ID đã cho');
    }

    const topic = `warehouse/gateway_${subDevice.deviceId.gatewayId.mac}/node_${subDevice.deviceId.mac}/control/state/cmd`;

    this.mqttSevice.publicToTopic(topic, {
      state: state,
    });

    return { message: 'Đã gửi lệnh điều khiển trạng thái quạt thành công' };
  }

  async controlStatus(subDeviceId: string, status: string) {
    const subDevice = await this.subDevicesService.findOne(subDeviceId);

    if (!subDevice) {
      throw new NotFoundException('Không tìm thấy thiết bị con với ID đã cho');
    }

    const topic = `warehouse/gateway_${subDevice.deviceId.gatewayId.mac}/node_${subDevice.deviceId.mac}/control/status/cmd`;

    this.mqttSevice.publicToTopic(topic, {
      status: status,
    });

    return { message: 'Đã gửi lệnh điều khiển trạng thái quạt thành công' };
  }

  async setWarningThreshold(
    deviceId: string,
    threshold: { min: number; max: number },
    type: string,
  ) {
    const device = await this.devicesService.findOne(deviceId);

    if (!device) {
      throw new NotFoundException('Không tìm thấy thiết bị với ID đã cho');
    }
    const topic = `warehouse/gateway_${device.gatewayId.mac}/node_${device.mac}/control/threshold/${type}/cmd`;

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
    const topic = `warehouse/gateway_${device.gatewayId.mac}/node_${device.mac}/control/rfid/user-infi/cmd`;

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
