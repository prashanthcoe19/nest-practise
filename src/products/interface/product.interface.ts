import { Product } from "../product.model";

export interface ProductWithId extends Product{
    _id: string;
}