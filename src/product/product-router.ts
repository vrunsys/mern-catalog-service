import { Router } from "express";
import { Role } from "../constants";
import authenticate from "../middleware/authenticate";
import { canAccess } from "../middleware/canAccess";
import { asyncWrapper } from "../utils/wrapper";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import productValidator from "./product-validator";

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

router.post(
	"/",
	authenticate,
	canAccess([Role.ADMIN]),
	productValidator,
	asyncWrapper(productController.create.bind(productController)),
);

export default router;
