import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductType } from 'src/entities/product-type.entity';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectModel(ProductType.name)
    private productTypeModule: Model<ProductType>,
  ) {}

  async create(createProductTypeDto: CreateProductTypeDto) {
    return await this.productTypeModule.create(createProductTypeDto);
  }

  async findAll() {
    return await this.productTypeModule.find().sort({ createdAt: -1 }).exec();
  }

  async remove(id: string) {
    return await this.productTypeModule.findByIdAndDelete(id).exec();
  }
}
