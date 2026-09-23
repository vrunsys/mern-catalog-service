import createHttpError from "http-errors";
import ToppingModel from "./topping-model";
import type {
	CreateToppingBody,
	PaginatedResult,
	PaginationOptions,
	ToppingFilter,
	UpdateToppingBody,
} from "./topping-types";

export class ToppingService {
	async create(toppingData: CreateToppingBody & { image: string }) {
		return await ToppingModel.create(toppingData);
	}

	async update(
		id: string,
		toppingData: UpdateToppingBody & { image?: string },
		tenantId?: string | null,
	) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) filter.tenantId = tenantId;

		const topping = await ToppingModel.findOneAndUpdate(
			filter,
			{ $set: toppingData },
			{ new: true },
		);
		if (!topping) {
			throw createHttpError(404, "Topping not found or access denied");
		}
		return topping;
	}

	async getAll(
		filter: ToppingFilter = {},
		{ page, limit }: PaginationOptions = { page: 1, limit: 10 },
	): Promise<PaginatedResult<(typeof ToppingModel)["prototype"]>> {
		const skip = (page - 1) * limit;
		const [data, total] = await Promise.all([
			ToppingModel.find(filter).select("-__v").skip(skip).limit(limit),
			ToppingModel.countDocuments(filter),
		]);
		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async getOne(id: string, tenantId?: string | null) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) filter.tenantId = tenantId;

		const topping = await ToppingModel.findOne(filter);
		if (!topping) {
			throw createHttpError(404, "Topping not found or access denied");
		}
		return topping;
	}

	async delete(id: string, tenantId?: string | null) {
		const filter: Record<string, unknown> = { _id: id };
		if (tenantId) filter.tenantId = tenantId;

		const topping = await ToppingModel.findOneAndDelete(filter);
		if (!topping) {
			throw createHttpError(404, "Topping not found or access denied");
		}
	}
}
