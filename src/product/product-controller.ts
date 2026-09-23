import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import logger from "../config/logger";
import type { CloudService } from "./cloud-service";
import type { ProductService } from "./product-service";
import type { CreateProductRequest } from "./product-types";

export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly cloudService: CloudService,
	) {}

	async create(req: CreateProductRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		if (!req.file) {
			return next(createHttpError(400, "Product image is required"));
		}

		const imageUrl = await this.cloudService.upload(req.file);

		const product = await this.productService.create({
			...req.body,
			image: imageUrl,
		});

		logger.info("Product created", { id: product._id });
		res.status(201).json({ id: product._id });
	}
}
