import type { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

const asyncWrapper =
	(fn: RequestHandler): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
			if (createHttpError.isHttpError(err)) {
				return next(createHttpError(500, err.message));
			}
			return next(createHttpError(500, "Internal Server Error"));
		});
	};

export { asyncWrapper };
