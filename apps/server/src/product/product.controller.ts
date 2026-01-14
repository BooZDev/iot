import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('product')
@UseGuards(RoleGuard)
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ sản phẩm' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('flow-state/:flowState')
  @ApiOperation({ summary: 'Lấy sản phẩm theo trạng thái luồng' })
  @ApiParam({ name: 'flowState', description: 'Trạng thái luồng của sản phẩm' })
  findAllWithFlowState(@Param('flowState') flowState: string) {
    return this.productService.findAllWithFlowState(flowState.toUpperCase());
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Tạo mới sản phẩm' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  @ApiBody({ type: UpdateProductDto })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/lock')
  @ApiOperation({ summary: 'Đặt trạng thái sản phẩm thành LOCKED' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  setLocked(@Param('id') id: string) {
    return this.productService.update(id, { flowState: 'LOCKED' });
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
