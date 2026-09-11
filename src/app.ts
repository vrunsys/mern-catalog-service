import config from "config";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import type { HttpError } from "http-errors";
import logger from "./config/logger";
import { globalError } from "./middleware/globalError";

const app = express();

// biome-ignore lint: correctness/noUnusedVariables
app.all("/health", (req, res) => {
	res.status(200).json({ status: "OK" });
});

// biome-ignore lint: correctness/noUnusedVariables
app.use(globalError);

export default app;
