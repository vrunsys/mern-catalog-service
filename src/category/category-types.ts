import type { Request } from "express";

export interface PrizeConfigurationEntry {
	priceType: "base" | "additional";
	options: string[];
}

export interface PrizeConfiguration {
	[key: string]: PrizeConfigurationEntry;
}

export interface Attribute {
	name: string;
	widgetType: "switch" | "radio";
	defaultValue: string;
	options?: string[];
}

export interface CreateCategoryBody {
	name: string;
	prizeConfiguration: PrizeConfiguration;
	attributes: Attribute[];
}

export interface CreateCategoryRequest extends Request {
	body: CreateCategoryBody;
}

export interface UpdateCategoryBody extends Partial<CreateCategoryBody> {}

export type UpdateCategoryRequest = Request<
	{ id: string },
	unknown,
	UpdateCategoryBody
>;

export type CategoryParamsRequest = Request<{ id: string }>;
