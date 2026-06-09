import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  databaseUrl: process.env.DATABASE_URL || "postgresql://authenticator:npg_9hoSf8ndtMjG@ep-aged-mud-aoia5hco-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "default-dev-secret-change-me",
  jwtExpiry: process.env.JWT_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Email
  emailFrom: process.env.EMAIL_FROM || "noreply@finpilot.in",
} as const;
