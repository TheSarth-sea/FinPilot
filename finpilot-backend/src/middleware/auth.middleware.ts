import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "./error.middleware";
import { AuthenticatedRequest } from "../types/express";

export function verifyToken(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token is required", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Access token is required", 401);
    }

    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token", 401));
    }
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    // Token invalid but auth is optional, continue
    next();
  }
}
