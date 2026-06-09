import jwt from "jsonwebtoken";
import { config } from "../config";

interface TokenPayload {
  userId: string;
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId } as TokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId } as TokenPayload, config.jwtSecret, {
    expiresIn: config.refreshTokenExpiry,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
