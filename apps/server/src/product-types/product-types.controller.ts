import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('product-types')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @ApiOperation({ summary: 'Lấy toàn bộ loại sản phẩm' })
  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Tạo mới loại sản phẩm' })
  @ApiBody({ type: CreateProductTypeDto })
  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xóa loại sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của loại sản phẩm' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypesService.remove(id);
  }
}
