import { Router } from "express";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import categoryValidator from "./category-validator";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.post(
	"/",
	categoryValidator,
	categoryController.create.bind(categoryController),
);

export default router;
