import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

class CreateProductRequestDto {
  product: CreateProductDto;
  deviceId: string;
}

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Tạo sản phẩm mới',
    description:
      'Tạo sản phẩm mới và gửi lệnh thiết lập thông tin sản phẩm cho thiết bị RFID',
  })
  @ApiBody({
    type: CreateProductRequestDto,
  })
  @Post()
  create(@Body() data: { product: CreateProductDto; deviceId: string }) {
    return this.productService.create(data);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.productService.findByWarehouse(warehouseId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
}
