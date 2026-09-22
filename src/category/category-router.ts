import { Router } from "express";
import { Role } from "../constants";
import authenticate from "../middleware/authenticate";
import { canAccess } from "../middleware/canAccess";
import { asyncWrapper } from "../utils/wrapper";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import categoryValidator from "./category-validator";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.post(
	"/",
	authenticate,
	canAccess([Role.ADMIN]),
	categoryValidator,
	asyncWrapper(categoryController.create.bind(categoryController)),
);

export default router;
