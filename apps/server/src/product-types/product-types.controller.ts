import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('product-types')
@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @ApiOperation({ summary: 'Lấy toàn bộ loại sản phẩm' })
  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @ApiOperation({ summary: 'Tạo mới loại sản phẩm' })
  @ApiBody({ type: CreateProductTypeDto })
  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @ApiOperation({ summary: 'Xóa loại sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của loại sản phẩm' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypesService.remove(id);
  }
}
