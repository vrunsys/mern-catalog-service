import CategoryModel from "./category-model";
import type { CreateCategoryBody } from "./category-types";

export class CategoryService {
	async create(categoryData: CreateCategoryBody) {
		return await CategoryModel.create(categoryData);
	}
}
