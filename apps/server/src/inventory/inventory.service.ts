import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem } from 'src/entities/inventoryItem.entity';
import { InventoryTransaction } from 'src/entities/inventoryTransaction.entity';
import CreateInventoryTransactionDto from './dto/create-inventoryTransaction.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryItemModel: Model<InventoryItem>,
    @InjectModel(InventoryTransaction.name)
    private inventoryTransactionModel: Model<InventoryTransaction>,
  ) {}

  async findAllInventoryItems() {
    return await this.inventoryItemModel.find().sort({ createdAt: -1 }).exec();
  }

  async findAllInventoryTransactionInByWarehouseId(warehouseId: string) {
    if (warehouseId === 'all') {
      return await this.inventoryTransactionModel
        .find({ transactionType: 'IN' })
        .sort({ createdAt: -1 })
        .exec();
    }

    return await this.inventoryTransactionModel
      .find({ warehouseId, transactionType: 'IN' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllInventoryTransactionOutByWarehouseId(warehouseId: string) {
    if (warehouseId === 'all') {
      return await this.inventoryTransactionModel
        .find({ transactionType: 'OUT' })
        .sort({ createdAt: -1 })
        .exec();
    }

    return await this.inventoryTransactionModel
      .find({ warehouseId, transactionType: 'OUT' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findInventoryItemByWarehouseId(warehouseId: string) {
    return await this.inventoryItemModel
      .find({ warehouseId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findInventoryItemByProductId(productId: string) {
    return await this.inventoryItemModel.find({ skuCode: productId }).exec();
  }

  async findInventoryItemByWarehouseIdAndProductId(
    warehouseId: string,
    productId: string,
  ) {
    return await this.inventoryItemModel
      .findOne({ warehouseId, productId })
      .exec();
  }

  async createInventoryTransaction(transaction: CreateInventoryTransactionDto) {
    return await this.inventoryTransactionModel.create(transaction);
  }
}
