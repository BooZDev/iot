import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/entities/product.entity';
import { Model } from 'mongoose';
import { ControlService } from 'src/control/control.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly controlService: ControlService,
  ) {}

  async create({
    product,
    deviceId,
  }: {
    product: CreateProductDto;
    deviceId: string;
  }) {
    await this.controlService.setRfidProductInfo(product.productCode, deviceId);

    return await this.productModel.create(product);
  }

  async findAll() {
    return await this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async findByProductCode(productCode: string) {
    return await this.productModel.findOne({ productCode: productCode }).exec();
  }

  async findByWarehouse(warehouseId: string) {
    return await this.productModel
      .find({ warehouseId: warehouseId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }
}
