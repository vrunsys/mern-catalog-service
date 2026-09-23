import mongoose from "mongoose";

export interface PriceConfiguration {
	[key: string]: {
		priceType: "base" | "additional";
		availableOptions: {
			[key: string]: number;
		};
	};
}

export interface Attribute {
	name: string;
	value: unknown;
}

export interface Product {
	name: string;
	description: string;
	image: string;
	priceConfiguration: PriceConfiguration;
	attributes: Attribute[];
	tenantId: string;
	categoryId: string;
	isPublish: boolean;
}

const priceConfigurationSchema = new mongoose.Schema({
	priceType: {
		type: String,
		enum: ["base", "additional"],
		required: true,
	},
	availableOptions: {
		type: Map,
		of: Number,
		required: true,
	},
});

const attributeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const productSchema = new mongoose.Schema<Product>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		priceConfiguration: {
			type: Map,
			of: priceConfigurationSchema,
			required: true,
		},
		attributes: { type: [attributeSchema], required: true },
		tenantId: { type: String, required: true },
		categoryId: { type: String, required: true },
		isPublish: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export default mongoose.model<Product>("Product", productSchema);
