import config from "config";
import { expressjwt, type GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";

const createAuthenticationMiddleware = (credentialsRequired: boolean) =>
	expressjwt({
		secret: jwksClient.expressJwtSecret({
			jwksUri: config.get("auth.jwksUri")!,
			cache: true,
			rateLimit: true,
		}) as GetVerificationKey,
		algorithms: ["RS256"],
		credentialsRequired,
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

export const optionalAuthenticate = createAuthenticationMiddleware(false);

export default createAuthenticationMiddleware(true);
