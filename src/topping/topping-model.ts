import mongoose from "mongoose";

export interface Topping {
	name: string;
	image: string;
	price: number;
	tenantId: string;
	isPublish: boolean;
}

const toppingSchema = new mongoose.Schema<Topping>(
	{
		name: { type: String, required: true },
		image: { type: String, required: true },
		price: { type: Number, required: true },
		tenantId: { type: String, required: true },
		isPublish: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export default mongoose.model<Topping>("Topping", toppingSchema);
