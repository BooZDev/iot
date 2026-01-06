import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { DataType } from './types/data.type';
import { DevicesService } from 'src/devices/devices.service';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';
import { RealtimeService } from 'src/realtime/realtime.service';
import { CreateAlertDto } from 'src/alert/dto/create-alert.dto';
import { AlertService } from 'src/alert/alert.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/entities/product.entity';
import { Model } from 'mongoose';

@Controller('mqtt')
export class MqttController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly dataService: DataService,
    private readonly devicesService: DevicesService,
    private readonly wsGateway: RealtimeGateway,
    private readonly realtimeService: RealtimeService,
    private readonly alertService: AlertService,
  ) {}

  @EventPattern('warehouse/+/+/env/data')
  async handleMqttMessage(
    @Ctx() context: MqttContext,
    @Payload()
    message: {
      temp: number;
      hum: number;
      gasLever: number;
      lightCurrent: number;
      ts: number;
    },
  ) {
    // console.log('Received MQTT message:', message);
    const topic = context.getTopic().split('/');
    const gatewayMac = topic[1].slice(4);
    const deviceMac = topic[2].slice(5);

    const gateway = await this.devicesService.findByMac(gatewayMac);
    const device = await this.devicesService.findByMac(deviceMac);

    if (!device) {
      console.error('Device not found for node mac:', deviceMac);
      return;
    }

    if (!gateway) {
      console.error('Gateway not found for gateway mac:', gatewayMac);
      return;
    }

    this.realtimeService.setLastMessage('environmentalData', message);
    this.wsGateway.server
      .to(`wh:${gateway.warehouseId.toString()}`)
      .emit('environmentalData', message);

    const timestamp = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

    const metadata = device._id;
    const warehouseId = gateway.warehouseId;

    const data: DataType = {
      temp: message.temp,
      hum: message.hum,
      gasLever: message.gasLever,
      lightCurrent: message.lightCurrent,
      ts: message.ts,
    };

    const createDataDto: CreateDataDto = {
      timestamp,
      metadata,
      warehouseId,
      data,
    };

    await this.dataService.create(createDataDto);
  }

  @EventPattern('warehouse/+/alert/data')
  async handleAlertDataMessage(
    @Ctx() context: MqttContext,
    @Payload()
    message: {
      level: string;
      reason: string;
      temp: number;
      hum: number;
      gasLever: number;
      lightCurrent: number;
      ts: number;
    },
  ) {
    const topic = context.getTopic().split('/');
    const gatewayMac = topic[1].slice(4);

    const gateway = await this.devicesService.findByMac(gatewayMac);
    if (!gateway) {
      console.error('Gateway not found for gateway mac:', gatewayMac);
      return;
    }

    const payload: CreateAlertDto = {
      level: message.level,
      reason: message.reason,
      value: message.reason.includes('TEMP')
        ? message.temp
        : message.reason.includes('HUM')
          ? message.hum
          : message.reason.includes('GAS')
            ? message.gasLever
            : message.reason.includes('LIGHT')
              ? message.lightCurrent
              : 0,
      status:
        message.level === 'warning'
          ? 'new'
          : message.level === 'danger'
            ? 'critical'
            : 'resolved',
      warehouseId: gateway.warehouseId.toString(),
    };

    if (payload.level === 'danger') {
      this.wsGateway.server
        .to(`wh:${gateway.warehouseId.toString()}`)
        .emit('alert', {...payload, level: 'critical' });
      return await this.alertService.update(gateway.warehouseId.toString(), {
        level: 'critical',
      });
    }

    this.wsGateway.server
      .to(`wh:${gateway.warehouseId.toString()}`)
      .emit('alert', payload);

    return await this.alertService.create(payload);
  }

  @EventPattern('warehouse/+/+/rfid/data')
  async handleRfidDataMessage(
    @Ctx() context: MqttContext,
    @Payload()
    message: {
      op: number;
      kind: number;
      id: string;
      ts: number;
    },
  ) {
    const topic = context.getTopic().split('/');
    const gatewayMac = topic[1].slice(4);
    const deviceMac = topic[2].slice(5);

    const gateway = await this.devicesService.findByMac(gatewayMac);
    const device = await this.devicesService.findByMac(deviceMac);

    if (!device) {
      console.error('Device not found for node mac:', deviceMac);
      return;
    }

    if (!gateway) {
      console.error('Gateway not found for gateway mac:', gatewayMac);
      return;
    }

    const product = await this.productModel
      .findOne({ productCode: message.id })
      .exec();

    if (!product) {
      console.error('Product not found for product code:', message.id);
      return;
    }

    if (product.status == 'READY_IN' && message.op == 1) {
      await this.productModel.findByIdAndUpdate(product._id, {
        status: 'IN_STOCK',
      });
    }

    if (product.status == 'READY_OUT' && message.op == 1) {
      await this.productModel.findByIdAndUpdate(product._id, {
        status: 'OUT_STOCK',
      });
    }

    this.wsGateway.server
      .to(`wh:${gateway.warehouseId.toString()}`)
      .emit('rfidData', message);
  }
}
