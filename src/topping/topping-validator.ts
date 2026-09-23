import { body } from "express-validator";

export default [
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("Topping name is required")
		.isString()
		.withMessage("Topping name must be a string")
		.trim()
		.notEmpty()
		.withMessage("Topping name must not be empty"),

	body("price")
		.exists()
		.withMessage("Topping price is required")
		.isNumeric()
		.withMessage("Topping price must be a number")
		.custom((value: number) => value >= 0)
		.withMessage("Topping price must be a positive number"),

	body("tenantId")
		.exists({ checkFalsy: true })
		.withMessage("Tenant ID is required")
		.isString()
		.withMessage("Tenant ID must be a string"),

	body("isPublish")
		.optional()
		.isBoolean()
		.withMessage("isPublish must be a boolean"),
];
