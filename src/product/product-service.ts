import createHttpError from "http-errors";
import ProductModel from "./product-model";
import type {
	CreateProductBody,
	ProductFilter,
	UpdateProductBody,
} from "./product-types";

export class ProductService {
	async create(productData: CreateProductBody) {
		return await ProductModel.create(productData);
	}

	async update(
		id: string,
		productData: UpdateProductBody,
		tenantId?: string | null,
	) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) {
			filter.tenantId = String(tenantId);
		}
		const product = await ProductModel.findOneAndUpdate(
			filter,
			{ $set: productData },
			{ new: true },
		);
		if (!product) {
			throw createHttpError(404, "Product not found or access denied");
		}
		return product;
	}

	async getAll(filter: ProductFilter = {}) {
		return await ProductModel.find(filter).select("-__v");
	}

	async getOne(id: string, tenantId?: string | null) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) {
			filter.tenantId = tenantId;
		}
		const product = await ProductModel.findOne(filter);
		if (!product) {
			throw createHttpError(404, "Product not found or access denied");
		}
		return product;
	}

	async delete(id: string, tenantId?: string | null) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) {
			filter.tenantId = String(tenantId);
		}
		const product = await ProductModel.findOneAndDelete(filter);
		if (!product) {
			throw createHttpError(404, "Product not found or access denied");
		}
	}
}
