import { Router } from "express";
import {
  getSummary,
  getHealthScore,
  getNetWorth,
  getTrends,
} from "../controllers/dashboard.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.get("/summary", getSummary);
router.get("/health-score", getHealthScore);
router.get("/net-worth", getNetWorth);
router.get("/trends", getTrends);

export default router;
