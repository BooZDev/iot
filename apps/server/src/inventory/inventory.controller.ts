import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import CreateInventoryTransactionDto from './dto/create-inventoryTransaction.dto';
import { OutboundScheduleService } from 'src/outbound-schedule/outbound-schedule.service';
import { MqttService } from 'src/mqtt/mqtt.service';
import { DevicesService } from 'src/devices/devices.service';
import { ProductService } from 'src/product/product.service';
import { ProductFlowState } from 'src/product/enums/productFlowState.enum';

@ApiTags('inventory')
@Controller('inventories')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly outboundScheduleService: OutboundScheduleService,
    private readonly mqttService: MqttService,
    private readonly devicesService: DevicesService,
    private readonly productService: ProductService,
  ) {}

  @ApiOperation({ summary: 'Lấy tất cả mục tồn kho' })
  @Get()
  async getAllInventoryItems() {
    return this.inventoryService.findAllInventoryItems();
  }

  @ApiOperation({ summary: 'Lấy mục tồn kho theo ID kho' })
  @ApiParam({ name: 'warehouseId', description: 'ID của kho' })
  @Get('items/warehouse/:warehouseId')
  async getInventoryItemsByWarehouseId(
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.findInventoryItemByWarehouseId(warehouseId);
  }

  @ApiOperation({ summary: 'Lấy tất cả yêu cầu nhập kho theo ID kho' })
  @ApiParam({ name: 'warehouseId', description: 'ID của kho' })
  @Get('in/:warehouseId')
  async getAllInventoryInRequests(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findAllInventoryTransactionInByWarehouseId(
      warehouseId,
    );
  }

  @ApiOperation({ summary: 'Lấy tất cả yêu cầu xuất kho theo ID kho' })
  @ApiParam({ name: 'warehouseId', description: 'ID của kho' })
  @Get('out/:warehouseId')
  async getAllInventoryOutRequests(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findAllInventoryTransactionOutByWarehouseId(
      warehouseId,
    );
  }

  @ApiOperation({ summary: 'Yêu cầu nhập kho' })
  @ApiBody({ type: CreateInventoryTransactionDto })
  @Post('in/request')
  async requestInventoryIn(
    @Body() createInventoryTransactionDto: CreateInventoryTransactionDto,
  ) {
    const device = await this.devicesService.findOne(
      createInventoryTransactionDto.rfidTagId,
    );

    const product = await this.productService.findOne(
      createInventoryTransactionDto.productId,
    );

    if (!product) {
      throw new BadRequestException('Không tìm thấy sản phẩm được chỉ định');
    }

    if (product.flowState === ProductFlowState.BLOCKED) {
      throw new BadRequestException(
        'Sản phẩm đang bị khóa, không thể nhập kho',
      );
    }

    if (product.flowState === ProductFlowState.READY_OUT) {
      throw new BadRequestException(
        'Sản phẩm đang ở trạng thái sẵn sàng xuất kho, không thể nhập kho',
      );
    }

    if (!device) {
      throw new BadRequestException(
        'Không tìm thấy thiết bị cho kho được chỉ định',
      );
    }

    await this.inventoryService.createInventoryTransaction({
      ...createInventoryTransactionDto,
      transactionType: 'IN',
    });

    const topic = `warehouse/gtw_${device.gatewayId.mac}/node_${device.mac}/rfid/cmd`;

    this.mqttService.publicToTopic(topic, {
      kind: 2,
      id: product.skuCode,
      ttl: 30000,
    });

    return { message: 'Yêu cầu nhập kho đã được gửi đến thiết bị RFID' };
  }

  @ApiOperation({ summary: 'Yêu cầu xuất kho' })
  @ApiBody({ type: CreateInventoryTransactionDto })
  @Post('out/request')
  async requestInventoryOut(
    @Body() createInventoryTransactionDto: CreateInventoryTransactionDto,
  ) {
    const outboundSchedule =
      await this.outboundScheduleService.findAllByWarehouseIdAndProductId(
        createInventoryTransactionDto.warehouseId,
        createInventoryTransactionDto.productId,
      );

    if (!outboundSchedule) {
      throw new Error(
        'Không có lịch xuất kho phù hợp cho sản phẩm này tại kho được chỉ định',
      );
    }

    const startAt = new Date(outboundSchedule.startAt);
    const endAt = new Date(outboundSchedule.endAt);
    const now = new Date();

    if (now < startAt || now > endAt) {
      throw new BadRequestException(
        'Yêu cầu xuất kho không nằm trong khoảng thời gian của lịch xuất kho',
      );
    }

    return this.inventoryService.createInventoryTransaction({
      ...createInventoryTransactionDto,
      transactionType: 'OUT',
    });
  }
}
