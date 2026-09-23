import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../config/logger";
import type { ProductService } from "./product-service";
import type { CreateProductRequest } from "./product-types";

export class ProductController {
	constructor(private readonly productService: ProductService) {}

	async create(req: CreateProductRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		const product = await this.productService.create(req.body);
		logger.info("Product created", { id: product._id });
		res.status(201).json({ id: product._id });
	}
}
