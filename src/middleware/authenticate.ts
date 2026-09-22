import config from "config";
import { expressjwt, type GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";

export default expressjwt({
	secret: jwksClient.expressJwtSecret({
		jwksUri: config.get("auth.jwksUri")!,
		cache: true,
		rateLimit: true,
	}) as GetVerificationKey,
	algorithms: ["RS256"],
	getToken: (req) => {
		const authHeader = req.headers.authorization;

		if (authHeader?.startsWith("Bearer ")) {
			const token = authHeader.split(" ")[1];
			if (token) {
				return token;
			}
		}

		const accessTokenCookie = req.cookies?.accessToken;
		return accessTokenCookie;
	},
});
