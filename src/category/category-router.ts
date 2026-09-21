import { Router } from "express";
import { asyncWrapper } from "../utils/wrapper";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import categoryValidator from "./category-validator";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.post(
	"/",
	categoryValidator,
	asyncWrapper(categoryController.create.bind(categoryController)),
);

export default router;
