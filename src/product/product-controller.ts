import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import logger from "../config/logger";
import { Role } from "../constants";
import type { CloudService } from "./cloud-service";
import type { ProductService } from "./product-service";
import type {
	CreateProductRequest,
	GetAllProductsRequest,
	ProductFilter,
	ProductParamsRequest,
	UpdateProductRequest,
} from "./product-types";

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

		// Manager can only create products for their own tenant
		if (req.auth.role === Role.MANAGER) {
			const tenantId = String(req.auth.tenantId);
			if (!tenantId || req.body.tenantId !== tenantId) {
				return next(
					createHttpError(403, "You can only create products for your tenant"),
				);
			}
		}

		const imageUrl = await this.cloudService.upload(req.file);

		const product = await this.productService.create({
			...req.body,
			image: imageUrl,
		});

		logger.info("Product created", { id: product._id });
		res.status(201).json({ id: product._id });
	}

	async update(req: UpdateProductRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		const { id } = req.params;
		const updateData = { ...req.body };

		// Admin can update any product; manager is scoped to their tenant
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		if (req.file) {
			const imageUrl = await this.cloudService.upload(req.file);
			updateData.image = imageUrl;
		}

		const product = await this.productService.update(id, updateData, tenantId);
		logger.info("Product updated", { id, tenantId });
		res.json(product);
	}

	async getAll(req: GetAllProductsRequest, res: Response, next: NextFunction) {
		const { q, tenantId, categoryId, isPublish, page, limit } = req.query;

		const filter: ProductFilter = {};

		// Search by name (case-insensitive)
		if (q) {
			filter.name = { $regex: q, $options: "i" };
		}

		// Managers are always scoped to their own tenant, ignoring query param
		if (req.auth.role === Role.MANAGER) {
			filter.tenantId = String(req.auth.tenantId);
		} else if (tenantId) {
			filter.tenantId = tenantId;
		}

		if (categoryId) filter.categoryId = categoryId;
		if (isPublish !== undefined) filter.isPublish = isPublish === "true";

		const pagination = {
			page: Math.max(1, Number(page) || 1),
			limit: Math.min(100, Math.max(1, Number(limit) || 10)),
		};

		logger.info("Fetching products", { filter, pagination });
		const result = await this.productService.getAll(filter, pagination);
		logger.info("Fetched products", {
			count: result.data.length,
			total: result.total,
		});
		res.json(result);
	}

	async getOne(req: ProductParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;

		// Admin can access any product; manager scoped to their tenant
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		const product = await this.productService.getOne(id, tenantId);
		logger.info("Fetched product", { id, tenantId });
		res.json(product);
	}

	async delete(req: ProductParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;

		// Admin can delete any product; manager scoped to their tenant
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		await this.productService.delete(id, tenantId);
		logger.info("Product deleted", { id, tenantId });
		res.json({ message: "Product deleted successfully" });
	}
}
