import type { Request } from "express";

export interface AuthCookie {
	refreshToken: string;
	accessToken: string;
}

export interface AuthRequest extends Request {
	auth: {
		id: number;
		role: string;
		iat: number;
		exp: number;
		tenantId: number | null;
	};
}
