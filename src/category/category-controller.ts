import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../config/logger";
import type { CategoryService } from "./category-service";
import type {
	CategoryParamsRequest,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "./category-types";

export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	async create(req: CreateCategoryRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		const { name, prizeConfiguration, attributes } = req.body;
		const category = await this.categoryService.create({
			name,
			prizeConfiguration,
			attributes,
		});
		logger.info("Category created", { id: category._id });
		res.status(201).json({ id: category._id });
	}

	async update(req: UpdateCategoryRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		const { id } = req.params;
		const category = await this.categoryService.update(id, req.body);
		logger.info("Category updated", { id });
		res.json(category);
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		const categories = await this.categoryService.getAll();
		logger.info("Fetched all categories", { count: categories.length });
		res.json(categories);
	}

	async getOne(req: CategoryParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;
		const category = await this.categoryService.getOne(id);
		logger.info("Fetched category", { id });
		res.json(category);
	}

	async delete(req: CategoryParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;
		await this.categoryService.delete(id);
		logger.info("Category deleted", { id });
		res.json({ message: "Category deleted successfully" });
	}
}
