import type { Request } from "express";

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

export type CreateProductRequest = Request<
	Record<string, never>,
	unknown,
	CreateProductBody
> & { file?: Express.Multer.File };
