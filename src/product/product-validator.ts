import { body } from "express-validator";

export default [
	// name
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("Product name is required")
		.isString()
		.withMessage("Product name must be a string")
		.trim()
		.notEmpty()
		.withMessage("Product name must not be empty"),

	// description
	body("description")
		.exists({ checkFalsy: true })
		.withMessage("Product description is required")
		.isString()
		.withMessage("Product description must be a string")
		.trim()
		.notEmpty()
		.withMessage("Product description must not be empty"),

	// image
	body("image")
		.exists({ checkFalsy: true })
		.withMessage("Product image is required")
		.isString()
		.withMessage("Product image must be a string"),

	// priceConfiguration
	body("priceConfiguration")
		.exists()
		.withMessage("Price configuration is required")
		.isObject()
		.withMessage("Price configuration must be an object"),

	body("priceConfiguration.*.priceType")
		.exists()
		.withMessage("priceType is required for each price configuration entry")
		.isIn(["base", "additional"])
		.withMessage('priceType must be either "base" or "additional"'),

	body("priceConfiguration.*.availableOptions")
		.exists()
		.withMessage(
			"availableOptions is required for each price configuration entry",
		)
		.isObject()
		.withMessage("availableOptions must be an object"),

	body("priceConfiguration.*.availableOptions.*")
		.isNumeric()
		.withMessage("Each availableOptions value must be a number"),

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

	body("attributes.*.value")
		.exists()
		.withMessage("Attribute value is required"),

	// tenantId
	body("tenantId")
		.exists({ checkFalsy: true })
		.withMessage("Tenant ID is required")
		.isString()
		.withMessage("Tenant ID must be a string"),

	// categoryId
	body("categoryId")
		.exists({ checkFalsy: true })
		.withMessage("Category ID is required")
		.isString()
		.withMessage("Category ID must be a string"),

	// isPublish (optional on create, defaults to false)
	body("isPublish")
		.optional()
		.isBoolean()
		.withMessage("isPublish must be a boolean"),
];
