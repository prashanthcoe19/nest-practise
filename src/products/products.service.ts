import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './product.dto';
import { ProductWithId } from './interface/product.interface';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(productDto: ProductDto, productOf: string): Promise<ProductWithId> {
    // const prodId = Math.random().toString();
    let { title, description, price } = productDto;
    const newProduct = new this.productModel({
      title,
      description,
      price,
      productOf,
    });
    const result = await newProduct.save();
    return result;
  }

  async getProducts(pageNum: number): Promise<ProductWithId[]> {
    const pageLimit = 3;
    const products = await this.productModel.find({})
        .limit(pageLimit)
        // .skip(pageLimit * (pageNum - 1));
    return products;
  }

  async getProduct(productId: string): Promise<ProductWithId> {
    const product = await this.productModel.findOne({ _id: productId });
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return product;
  }

  async updateProduct(productId: string, productDto): Promise<ProductWithId> {
    const products = await this.productModel.findOne({ _id: productId });
    products.title = productDto.title;
    products.description = productDto.description;
    products.price = productDto.price;
    let res = await products.save();
    return res;
  }

  async deleteProduct(productId: string): Promise<string> {
    await this.productModel.findByIdAndRemove({ _id: productId });
    return 'Products deleted successfully';
  }

  // private findProduct(id: string): [Product, number] {
  //   const productIndex = this.products.findIndex((prod) => prod.id == id);
  //   const product = this.products[productIndex];
  //   if (!product) {
  //     throw new NotFoundException('Could not find product');
  //   }
  //   return [product, productIndex];
  // }
}
