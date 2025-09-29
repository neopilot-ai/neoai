import type { Context, Next } from "hono";
import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { logger as customLogger } from "./utils/logger";

const PUBLIC_PATHS = ["/", "/openapi", "/health"];

const authMiddleware = (c: Context, next: Next) => {
  if (PUBLIC_PATHS.includes(c.req.path)) {
    return next();
  }

  const { API_SECRET_KEY } = env(c);

  const bearer = bearerAuth({ token: API_SECRET_KEY });

  return bearer(c, next);
};

const securityMiddleware = secureHeaders();
const loggingMiddleware = logger(customLogger);

export { authMiddleware, securityMiddleware, loggingMiddleware };
