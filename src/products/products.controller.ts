import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/auth/auth.model';
import { UserWithId } from 'src/auth/user.interface';
import { CurrentUser } from 'src/common/current-user';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async insert(
    @Body() createProductDto: ProductDto,
    @CurrentUser() userId: string,
  ) {
    const product = await this.productsService.insertProduct(
      createProductDto,
      userId
    );
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    const product = await this.productsService.getProduct(prodId);
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body() createProductDto: ProductDto,
  ) {
    const product = await this.productsService.updateProduct(
      prodId,
      createProductDto,
    );
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string) {
    await this.productsService.deleteProduct(prodId);
    return 'Deleted';
  }
}
