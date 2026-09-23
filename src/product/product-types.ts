import type { Request } from "express";
import type { AuthRequest } from "../types";

export interface PriceConfigurationEntry {
	priceType: "base" | "additional";
	availableOptions: {
		[key: string]: number;
	};
}

export interface PriceConfiguration {
	[key: string]: PriceConfigurationEntry;
}

export interface ProductAttribute {
	name: string;
	value: unknown;
}

export interface CreateProductBody {
	name: string;
	description: string;
	image: string;
	priceConfiguration: PriceConfiguration;
	attributes: ProductAttribute[];
	tenantId: string;
	categoryId: string;
	isPublish?: boolean;
}

export type CreateProductRequest = AuthRequest & {
	body: CreateProductBody;
	file?: Express.Multer.File;
};

export interface UpdateProductBody extends Partial<CreateProductBody> {}

export type UpdateProductRequest = AuthRequest & {
	body: UpdateProductBody;
	params: { id: string };
	file?: Express.Multer.File;
};

export type ProductParamsRequest = AuthRequest & {
	params: { id: string };
};

export interface ProductFilter {
	tenantId?: string;
	categoryId?: string;
	isPublish?: boolean;
	name?: { $regex: string; $options: string };
}

export type GetAllProductsRequest = AuthRequest & {
	query: {
		q?: string;
		tenantId?: string;
		categoryId?: string;
		isPublish?: string;
	};
};
