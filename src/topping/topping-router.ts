import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Role } from "../constants";
import authenticate from "../middleware/authenticate";
import { canAccess } from "../middleware/canAccess";
import upload from "../middleware/upload";
import { CloudService } from "../product/cloud-service";
import { asyncWrapper } from "../utils/wrapper";
import { ToppingController } from "./topping-controller";
import { ToppingService } from "./topping-service";
import toppingValidator from "./topping-validator";

const parseFormFields = (req: Request, _res: Response, next: NextFunction) => {
	if (req.body.price) {
		req.body.price = Number(req.body.price);
	}
	next();
};

const router = Router();
const toppingService = new ToppingService();
const cloudService = new CloudService();
const toppingController = new ToppingController(toppingService, cloudService);

router.post(
	"/",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	upload.single("image"),
	parseFormFields,
	toppingValidator,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(toppingController.create.bind(toppingController) as any),
);

router.patch(
	"/:id",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	upload.single("image"),
	parseFormFields,
	toppingValidator,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(toppingController.update.bind(toppingController) as any),
);

router.get(
	"/",
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(toppingController.getAll.bind(toppingController) as any),
);

router.get(
	"/:id",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(toppingController.getOne.bind(toppingController) as any),
);

router.delete(
	"/:id",
	authenticate,
	canAccess([Role.ADMIN, Role.MANAGER]),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncWrapper(toppingController.delete.bind(toppingController) as any),
);

export default router;
