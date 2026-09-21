import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../config/logger";
import type { CategoryService } from "./category-service";
import type { CreateCategoryRequest } from "./category-types";

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
		res.status(201).json({ _id: category._id });
	}
}
