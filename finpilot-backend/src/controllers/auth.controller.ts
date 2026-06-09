import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/prisma";
import { config } from "../config";
import { AppError } from "../middleware/error.middleware";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AuthenticatedRequest } from "../types/express";

const googleClient = new OAuth2Client(config.googleClientId);

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// POST /api/auth/signup
export async function signup(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verifyToken = uuidv4();
    const verifyTokenHash = hashToken(verifyToken);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        provider: "EMAIL",
        verifyToken,
        verifyTokenHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Create financial profile for the user
    await prisma.financialProfile.create({
      data: { userId: user.id },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshTokenValue = generateRefreshToken(user.id);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashToken(refreshTokenValue),
        expiresAt,
      },
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth",
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        verificationToken: verifyToken, // In production, send via email
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        provider: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.provider === "GOOGLE") {
      throw new AppError(
        "This account uses Google Sign-In. Please login with Google.",
        400
      );
    }

    if (!user.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshTokenValue = generateRefreshToken(user.id);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashToken(refreshTokenValue),
        expiresAt,
      },
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/google
export async function googleAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError("Invalid Google token", 401);
    }

    const { email, name, picture, email_verified } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Google User",
          avatarUrl: picture,
          provider: "GOOGLE",
          emailVerified: email_verified || false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          provider: true,
          emailVerified: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      // Create financial profile for new Google user
      await prisma.financialProfile.create({
        data: { userId: user.id },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshTokenValue = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashToken(refreshTokenValue),
        expiresAt,
      },
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/refresh
export async function refreshToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw new AppError("Refresh token is required", 401);
    }

    // Verify JWT validity
    const payload = verifyRefreshToken(token);

    // Check session in DB
    const tokenHash = hashToken(token);
    const session = await prisma.session.findFirst({
      where: {
        userId: payload.userId,
        refreshToken: tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Delete old session
    await prisma.session.delete({ where: { id: session.id } });

    // Generate new token pair
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: payload.userId,
        refreshToken: hashToken(newRefreshToken),
        expiresAt,
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/forgot-password
export async function forgotPassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || user.provider === "GOOGLE") {
      res.json({
        success: true,
        data: {
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
      });
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenHash = hashToken(resetToken);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenHash,
        resetTokenExpiry,
      },
    });

    // In a production app, send email with reset link
    // For now, return the token directly
    res.json({
      success: true,
      data: {
        message:
          "If an account with that email exists, a password reset link has been sent.",
        resetToken, // Remove in production - would be sent via email
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/reset-password
export async function resetPassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, password } = req.body;

    const tokenHash = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });

    // Invalidate all existing sessions for security
    await prisma.session.deleteMany({ where: { userId: user.id } });

    res.json({
      success: true,
      data: {
        message: "Password has been reset successfully. Please login again.",
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/verify-email
export async function verifyEmail(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;

    const tokenHash = hashToken(token);

    const user = await prisma.user.findFirst({
      where: { verifyTokenHash: tokenHash },
    });

    if (!user) {
      throw new AppError("Invalid verification token", 400);
    }

    if (user.emailVerified) {
      res.json({
        success: true,
        data: { message: "Email is already verified." },
      });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenHash: null,
      },
    });

    res.json({
      success: true,
      data: { message: "Email verified successfully." },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/logout
export async function logout(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const tokenHash = hashToken(token);
      // Delete the session matching this refresh token
      await prisma.session.deleteMany({
        where: {
          userId: req.userId!,
          refreshToken: tokenHash,
        },
      });
    }

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      path: "/api/auth",
    });

    res.json({
      success: true,
      data: { message: "Logged out successfully." },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        financialProfile: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
