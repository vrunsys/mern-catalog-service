import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import logger from "../config/logger";
import { Role } from "../constants";
import type { CloudService } from "../product/cloud-service";
import type { ToppingService } from "./topping-service";
import type {
	CreateToppingRequest,
	GetAllToppingsRequest,
	ToppingFilter,
	ToppingParamsRequest,
	UpdateToppingRequest,
} from "./topping-types";

export class ToppingController {
	constructor(
		private readonly toppingService: ToppingService,
		private readonly cloudService: CloudService,
	) {}

	async create(req: CreateToppingRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		if (!req.file) {
			return next(createHttpError(400, "Topping image is required"));
		}

		// Manager can only create toppings for their own tenant
		if (req.auth.role === Role.MANAGER) {
			const tenantId = String(req.auth.tenantId);
			if (!tenantId || req.body.tenantId !== tenantId) {
				return next(
					createHttpError(403, "You can only create toppings for your tenant"),
				);
			}
		}

		const imageUrl = await this.cloudService.upload(req.file);
		const topping = await this.toppingService.create({
			...req.body,
			image: imageUrl,
		});

		logger.info("Topping created", { id: topping._id });
		res.status(201).json({ id: topping._id });
	}

	async update(req: UpdateToppingRequest, res: Response, next: NextFunction) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return next(result.array());
		}

		const { id } = req.params;
		const updateData: UpdateToppingRequest["body"] & { image?: string } = {
			...req.body,
		};

		// Admin can update any topping; manager scoped to their tenant
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		if (req.file) {
			updateData.image = await this.cloudService.upload(req.file);
		}

		const topping = await this.toppingService.update(id, updateData, tenantId);
		logger.info("Topping updated", { id, tenantId });
		res.json(topping);
	}

	async getAll(req: GetAllToppingsRequest, res: Response, next: NextFunction) {
		const { q, tenantId, isPublish, page, limit } = req.query;

		const filter: ToppingFilter = {};

		if (q) filter.name = { $regex: q, $options: "i" };

		// Manager always scoped to their own tenant
		if (req.auth.role === Role.MANAGER) {
			filter.tenantId = String(req.auth.tenantId);
		} else if (tenantId) {
			filter.tenantId = tenantId;
		}

		if (isPublish !== undefined) filter.isPublish = isPublish === "true";

		const pagination = {
			page: Math.max(1, Number(page) || 1),
			limit: Math.min(100, Math.max(1, Number(limit) || 10)),
		};

		logger.info("Fetching toppings", { filter, pagination });
		const result = await this.toppingService.getAll(filter, pagination);
		logger.info("Fetched toppings", {
			count: result.data.length,
			total: result.total,
		});
		res.json(result);
	}

	async getOne(req: ToppingParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		const topping = await this.toppingService.getOne(id, tenantId);
		logger.info("Fetched topping", { id, tenantId });
		res.json(topping);
	}

	async delete(req: ToppingParamsRequest, res: Response, next: NextFunction) {
		const { id } = req.params;
		const tenantId =
			req.auth.role === Role.ADMIN ? null : String(req.auth.tenantId);

		await this.toppingService.delete(id, tenantId);
		logger.info("Topping deleted", { id, tenantId });
		res.json({ message: "Topping deleted successfully" });
	}
}
