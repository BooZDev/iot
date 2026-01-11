import { Injectable } from '@nestjs/common';
import { CreateOutboundScheduleDto } from './dto/create-outbound-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OutboundSchedule } from 'src/entities/outboundSchedule.entity';
import { Model } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { ProductFlowState } from 'src/product/enums/productFlowState.enum';

@Injectable()
export class OutboundScheduleService {
  constructor(
    @InjectModel(OutboundSchedule.name)
    private outboundScheduleModel: Model<OutboundSchedule>,
    private readonly productService: ProductService,
  ) {}

  async create(createOutboundScheduleDto: CreateOutboundScheduleDto) {
    await this.productService.update(createOutboundScheduleDto.productId, {
      flowState: ProductFlowState.READY_OUT,
    });

    return await this.outboundScheduleModel.create(createOutboundScheduleDto);
  }

  async findAll() {
    return await this.outboundScheduleModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllByWarehouseId(warehouseId: string) {
    return await this.outboundScheduleModel
      .find({ warehouseId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllByWarehouseIdAndProductId(
    warehouseId: string,
    productId: string,
  ) {
    return (
      (await this.outboundScheduleModel
        .findOne({ warehouseId, productId: productId })
        .exec()) || null
    );
  }

  remove(id: string) {
    return this.outboundScheduleModel.findByIdAndDelete(id).exec();
  }
}
