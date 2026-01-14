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
import { InventoryItem } from 'src/entities/inventoryItem.entity';
import {
  InventoryTransaction,
  InventoryTransactionStatus,
  InventoryTransactionType,
} from 'src/entities/inventoryTransaction.entity';
import { CreateInventoryItemDto } from 'src/inventory/dto/create-inventoryItem.dto';
import { MailService } from 'src/mail/mail.service';

@Controller('mqtt')
export class MqttController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(InventoryItem.name)
    private inventoryItemModel: Model<InventoryItem>,
    @InjectModel(InventoryTransaction.name)
    private inventoryTransactionModel: Model<InventoryTransaction>,
    private readonly dataService: DataService,
    private readonly devicesService: DevicesService,
    private readonly wsGateway: RealtimeGateway,
    private readonly realtimeService: RealtimeService,
    private readonly alertService: AlertService,
    private readonly mailService: MailService,
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
        .emit('alert', { ...payload, level: 'critical' });

      await this.mailService.sendMailAPI(
        process.env.MAIL_TO as string,
        'Cảnh báo CRITICAL từ hệ thống IoT Warehouse!',
        `Cảnh báo: ${payload.reason} với mức độ CRITICAL!`,
      );

      return await this.alertService.findLatestByWarehouseAndUpdate(
        gateway.warehouseId.toString(),
        {
          level: 'critical',
        },
      );
    }

    this.wsGateway.server
      .to(`wh:${gateway.warehouseId.toString()}`)
      .emit('alert', payload);

    await this.mailService.sendMailAPI(
      process.env.MAIL_TO as string,
      'Cảnh báo từ hệ thống IoT Warehouse!',
      `Cảnh báo: ${payload.reason} với mức độ ${payload.level.toUpperCase()}!`,
    );

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
      .findOne({ skuCode: message.id })
      .exec();

    if (!product) {
      console.error('Không có sản phầm mang mã này:', message.id);
      return;
    }

    if (message.op === 3) {
      const transaction = await this.inventoryTransactionModel.findOne({
        productId: product._id.toString(),
        warehouseId: gateway.warehouseId,
        transactionType: InventoryTransactionType.IN,
        status: InventoryTransactionStatus.PENDING,
      });

      if (!transaction) {
        console.error(
          'Không tìm thấy giao dịch nhập kho phù hợp để cập nhật trạng thái hoàn thành.',
        );
        return;
      }

      transaction.status = InventoryTransactionStatus.COMPLETED;
      await transaction.save();

      const inventoryItem = await this.inventoryItemModel.findOne({
        productId: product._id.toString(),
        warehouseId: gateway.warehouseId,
      });

      if (inventoryItem) {
        inventoryItem.quantity += transaction.quantity;
        inventoryItem.lastInAt = new Date();
        await inventoryItem.save();
        this.wsGateway.server.emit('rfidInSuccess', {
          message: `Nhập kho thành công sản phẩm ${product.name} (SKU: ${product.skuCode}).`,
        });
        return;
      }

      const createInventoryItem: CreateInventoryItemDto = {
        productId: product._id.toString(),
        warehouseId: gateway.warehouseId.toString(),
        quantity: transaction.quantity,
        lastInAt: new Date(),
      };

      await this.inventoryItemModel.create(createInventoryItem);
      this.wsGateway.server.emit('rfidInSuccess', {
        message: `Nhập kho thành công sản phẩm ${product.name} (SKU: ${product.skuCode}).`,
      });
    } else if (message.op === 1) {
      const transaction = await this.inventoryTransactionModel.findOne({
        productId: product._id.toString(),
        warehouseId: gateway.warehouseId,
        transactionType: InventoryTransactionType.OUT,
        status: InventoryTransactionStatus.PENDING,
      });

      if (
        !transaction ||
        transaction.transactionType !== InventoryTransactionType.OUT
      ) {
        this.wsGateway.server.emit('rfidError', {
          message: `Giao dịch xuất kho không hợp lệ cho sản phẩm ${product.name} (SKU: ${product.skuCode}). Vui lòng kiểm tra lại.`,
        });

        await this.mailService.sendMailAPI(
          process.env.MAIL_TO as string,
          'Lỗi giao dịch xuất kho từ hệ thống IoT Warehouse!',
          `Giao dịch xuất kho không hợp lệ cho sản phẩm ${product.name} (SKU: ${product.skuCode}). Vui lòng kiểm tra lại.`,
        );

        console.error(
          'Không tìm thấy giao dịch xuất kho phù hợp để cập nhật trạng thái hoàn thành.',
        );
        return;
      }

      const inventoryItem = await this.inventoryItemModel.findOne({
        productId: product._id.toString(),
        warehouseId: gateway.warehouseId,
      });

      if (!inventoryItem) {
        console.error(
          'Không tìm thấy mục tồn kho phù hợp để cập nhật số lượng.',
        );
        return;
      }

      if (inventoryItem.quantity < transaction.quantity) {
        console.error(
          'Số lượng trong kho không đủ để thực hiện giao dịch xuất kho.',
        );
        transaction.status = InventoryTransactionStatus.CANCELLED;
        await transaction.save();
        return;
      }

      transaction.status = InventoryTransactionStatus.COMPLETED;
      await transaction.save();

      inventoryItem.quantity -= transaction.quantity;
      inventoryItem.lastOutAt = new Date();
      await inventoryItem.save();

      this.wsGateway.server.emit('rfidOutSuccess', {
        message: `Xuất kho thành công sản phẩm ${product.name} (SKU: ${product.skuCode}).`,
      });
    }
  }
}
