import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/entities/product.entity';
import { ControlModule } from 'src/control/control.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ControlModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
