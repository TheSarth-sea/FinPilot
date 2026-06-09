import { Router } from "express";
import {
  getCurrentBudget,
  createBudget,
  updateBudget,
  getBudgetRecommendations,
} from "../controllers/budget.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createBudgetSchema,
  updateBudgetSchema,
  idParamSchema,
} from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.get("/recommendations", getBudgetRecommendations);
router.get("/", getCurrentBudget);
router.post("/", validate(createBudgetSchema), createBudget);
router.put("/:id", validate(idParamSchema, "params"), validate(updateBudgetSchema), updateBudget);

export default router;
