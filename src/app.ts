import config from "config";
import cookieParser from "cookie-parser";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import categoryRouter from "./category/category-router";
import { globalError } from "./middleware/globalError";
import productRouter from "./product/product-router";

const app = express();

app.use(express.json());
app.use(cookieParser());
// biome-ignore lint: correctness/noUnusedVariables
app.all("/health", (req, res) => {
	res.status(200).json({ status: "OK" });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);

// biome-ignore lint: correctness/noUnusedVariables
app.use(globalError);

export default app;
