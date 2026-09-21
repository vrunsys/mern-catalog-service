import config from "config";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import type { HttpError } from "http-errors";
import categoryRouter from "./category/category-router";
import logger from "./config/logger";
import { globalError } from "./middleware/globalError";

const app = express();

app.use(express.json());
// biome-ignore lint: correctness/noUnusedVariables
app.all("/health", (req, res) => {
	res.status(200).json({ status: "OK" });
});

app.use("/categories", categoryRouter);

// biome-ignore lint: correctness/noUnusedVariables
app.use(globalError);

export default app;
