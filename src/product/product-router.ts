import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Role } from "../constants";
import authenticate from "../middleware/authenticate";
import { canAccess } from "../middleware/canAccess";
import upload from "../middleware/upload";
import { asyncWrapper } from "../utils/wrapper";
import { CloudService } from "./cloud-service";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import productValidator from "./product-validator";

const parseFormFields = (req: Request, _res: Response, next: NextFunction) => {
	if (req.body.priceConfiguration) {
		req.body.priceConfiguration = JSON.parse(
			req.body.priceConfiguration as string,
		);
	}
	if (req.body.attributes) {
		req.body.attributes = JSON.parse(req.body.attributes as string);
	}
	next();
};

const router = Router();
const productService = new ProductService();
const cloudService = new CloudService();
const productController = new ProductController(productService, cloudService);

router.post(
	"/",
	authenticate,
	canAccess([Role.ADMIN]),
	upload.single("image"),
	parseFormFields,
	productValidator,
	asyncWrapper(productController.create.bind(productController)),
);

export default router;
