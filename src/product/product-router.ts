import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Role } from "../constants";
import authenticate, { optionalAuthenticate } from "../middleware/authenticate";
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
	canAccess([Role.ADMIN, Role.MANAGER]),
	upload.single("image"),
	parseFormFields,
	productValidator,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(productController.create.bind(productController) as any),
);

router.patch(
	"/:id",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	upload.single("image"),
	parseFormFields,
	productValidator,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(productController.update.bind(productController) as any),
);

router.get(
	"/",
	optionalAuthenticate,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(productController.getAll.bind(productController) as any),
);

router.get(
	"/:id",
	optionalAuthenticate,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(productController.getOne.bind(productController) as any),
);

router.delete(
	"/:id",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(productController.delete.bind(productController) as any),
);

export default router;
