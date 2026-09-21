import { body } from "express-validator";

export default [
	// name
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("Category name is required")
		.isString()
		.withMessage("Category name must be a string")
		.trim()
		.notEmpty()
		.withMessage("Category name must not be empty"),

	// prizeConfiguration
	body("prizeConfiguration")
		.exists()
		.withMessage("Prize configuration is required")
		.isObject()
		.withMessage("Prize configuration must be an object"),

	body("prizeConfiguration.*.priceType")
		.exists()
		.withMessage("priceType is required for each prize configuration entry")
		.isIn(["base", "additional"])
		.withMessage('priceType must be either "base" or "additional"'),

	body("prizeConfiguration.*.options")
		.exists()
		.withMessage("options are required for each prize configuration entry")
		.isArray({ min: 1 })
		.withMessage("options must be a non-empty array"),

	body("prizeConfiguration.*.options.*")
		.isString()
		.withMessage("Each option must be a string"),

	// attributes
	body("attributes")
		.exists()
		.withMessage("Attributes are required")
		.isArray()
		.withMessage("Attributes must be an array"),

	body("attributes.*.name")
		.exists({ checkFalsy: true })
		.withMessage("Attribute name is required")
		.isString()
		.withMessage("Attribute name must be a string"),

	body("attributes.*.widgetType")
		.exists()
		.withMessage("Attribute widgetType is required")
		.isIn(["switch", "radio"])
		.withMessage('Attribute widgetType must be either "switch" or "radio"'),

	body("attributes.*.defaultValue")
		.exists()
		.withMessage("Attribute defaultValue is required"),

	body("attributes.*.options")
		.optional()
		.isArray()
		.withMessage("Attribute options must be an array when provided"),

	body("attributes.*.options.*")
		.optional()
		.isString()
		.withMessage("Each attribute option must be a string"),
];
