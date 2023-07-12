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
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/current-user';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';
import { ProductWithId } from './interface/product.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async insert(
    @Body() createProductDto: ProductDto,
    @CurrentUser() userId: string,
  ):Promise<ProductWithId> {
    const product = await this.productsService.insertProduct(
      createProductDto,
      userId
    );
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiQuery({name: 'pageNum', type: Number})
  async getAllProducts(@Query() query: { pageNum: number }): Promise<ProductWithId[]> {
    const pageNum = query.pageNum;
    const products = await this.productsService.getProducts(pageNum);
    return products;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getProduct(@Param('id') prodId: string): Promise<ProductWithId> {
    const product = await this.productsService.getProduct(prodId);
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body() createProductDto: ProductDto,
  ): Promise<ProductWithId> {
    const product = await this.productsService.updateProduct(
      prodId,
      createProductDto,
    );
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string): Promise<string> {
    await this.productsService.deleteProduct(prodId);
    return 'Deleted';
  }
}
