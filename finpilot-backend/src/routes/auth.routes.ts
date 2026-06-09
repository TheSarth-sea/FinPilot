import { Router } from "express";
import {
  signup,
  login,
  googleAuth,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  getMe,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { authRateLimiter } from "../middleware/security.middleware";
import {
  signupSchema,
  loginSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/auth.validator";

const router = Router();

// Apply stricter rate limiting to all auth routes
router.use(authRateLimiter);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleAuthSchema), googleAuth);
router.post("/refresh", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

export default router;
