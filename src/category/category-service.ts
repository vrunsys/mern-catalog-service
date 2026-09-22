import createHttpError from "http-errors";
import CategoryModel from "./category-model";
import type { CreateCategoryBody, UpdateCategoryBody } from "./category-types";

export class CategoryService {
	async create(categoryData: CreateCategoryBody) {
		return await CategoryModel.create(categoryData);
	}

	async update(id: string, categoryData: UpdateCategoryBody) {
		const category = await CategoryModel.findByIdAndUpdate(
			id,
			{ $set: categoryData },
			{ new: true },
		);
		if (!category) {
			throw createHttpError(404, "Category not found");
		}
		return category;
	}

	async getAll() {
		return await CategoryModel.find();
	}

	async getOne(id: string) {
		const category = await CategoryModel.findById(id);
		if (!category) {
			throw createHttpError(404, "Category not found");
		}
		return category;
	}

	async delete(id: string) {
		const category = await CategoryModel.findByIdAndDelete(id);
		if (!category) {
			throw createHttpError(404, "Category not found");
		}
	}
}
