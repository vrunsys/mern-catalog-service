import ProductModel from "./product-model";
import type { CreateProductBody } from "./product-types";

export class ProductService {
	async create(productData: CreateProductBody) {
		return await ProductModel.create(productData);
	}
}
