import createHttpError from "http-errors";
import ProductModel from "./product-model";
import type {
	CreateProductBody,
	PaginatedResult,
	PaginationOptions,
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

	async getAll(
		filter: ProductFilter = {},
		{ page, limit }: PaginationOptions = { page: 1, limit: 10 },
	): Promise<PaginatedResult<(typeof ProductModel)["prototype"]>> {
		const skip = (page - 1) * limit;
		const [data, total] = await Promise.all([
			ProductModel.find(filter).select("-__v").skip(skip).limit(limit),
			ProductModel.countDocuments(filter),
		]);
		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async getOne(id: string, tenantId?: string | null, isPublish?: boolean) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) {
			filter.tenantId = tenantId;
		}
		if (isPublish !== undefined) {
			filter.isPublish = isPublish;
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
