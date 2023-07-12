import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/auth.model';
@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: Number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  productOf: string;
}

export const ProductSchema: MongooseSchema =
  SchemaFactory.createForClass(Product);
