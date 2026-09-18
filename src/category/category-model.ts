import mongoose from "mongoose";

export interface Category {
	name: string;
	prizeConfiguration: PrizeConfiguration;
	attributes: Attribute[];
}

export interface PrizeConfiguration {
	[key: string]: {
		priceType: "base" | "additional";
		options: string[];
	};
}

export interface Attribute {
	name: string;
	widgetType: "switch" | "radio";
	defaultValue: string;
	options?: string[];
}

const prizeConfigurationSchema = new mongoose.Schema<PrizeConfiguration>({
	type: { type: String, required: true },
	options: { type: [String], required: true },
});

const attributeSchema = new mongoose.Schema<Attribute>({
	name: { type: String, required: true },
	widgetType: { type: String, enum: ["switch", "radio"], required: true },
	defaultValue: { type: mongoose.Schema.Types.Mixed, required: true },
	options: { type: [String], required: false },
});

const categorySchema = new mongoose.Schema<Category>({
	name: { type: String, required: true },
	prizeConfiguration: {
		type: Map,
		of: prizeConfigurationSchema,
		required: true,
	},
	attributes: { type: [Object], required: true },
});

export default mongoose.model<Category>("Category", categorySchema);
