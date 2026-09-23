import type { AuthRequest } from "../types";

export interface CreateToppingBody {
	name: string;
	price: number;
	tenantId: string;
	isPublish?: boolean;
}

export interface UpdateToppingBody extends Partial<CreateToppingBody> {}

export interface ToppingFilter {
	tenantId?: string;
	isPublish?: boolean;
	name?: { $regex: string; $options: string };
}

export interface PaginationOptions {
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type CreateToppingRequest = AuthRequest & {
	body: CreateToppingBody;
	file?: Express.Multer.File;
};

export type UpdateToppingRequest = AuthRequest & {
	body: UpdateToppingBody;
	params: { id: string };
	file?: Express.Multer.File;
};

export type ToppingParamsRequest = AuthRequest & {
	params: { id: string };
};

export type GetAllToppingsRequest = AuthRequest & {
	query: {
		q?: string;
		tenantId?: string;
		isPublish?: string;
		page?: string;
		limit?: string;
	};
};
