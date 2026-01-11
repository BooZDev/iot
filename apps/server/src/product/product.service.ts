import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  async findAll() {
    return await this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async findByProductCode(productCode: string) {
    return await this.productModel.findOne({ skuCode: productCode }).exec();
  }

  async findAllWithFlowState(flowState: string) {
    return await this.productModel
      .find({ flowState })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id).exec();
  }
}
