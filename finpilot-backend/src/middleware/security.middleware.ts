import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import sanitizeHtml from "sanitize-html";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { config } from "../config";

export const helmetMiddleware = helmet();

export const corsMiddleware = cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export const compressionMiddleware = compression() as unknown as RequestHandler;

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests, please try again later.",
      statusCode: 429,
    },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many authentication attempts, please try again later.",
      statusCode: 429,
    },
  },
});

/**
 * Sanitize all string fields in request body to prevent XSS
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
}

export function inputSanitizer(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    const sanitizedQuery: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(req.query)) {
      sanitizedQuery[key] = sanitizeValue(val);
    }
    req.query = sanitizedQuery as any;
  }
  next();
}
