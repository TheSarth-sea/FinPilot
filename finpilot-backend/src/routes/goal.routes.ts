import { Router } from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalPredictions,
} from "../controllers/goal.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createGoalSchema,
  updateGoalSchema,
  idParamSchema,
} from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.get("/predictions", getGoalPredictions);
router.get("/", getGoals);
router.post("/", validate(createGoalSchema), createGoal);
router.put("/:id", validate(idParamSchema, "params"), validate(updateGoalSchema), updateGoal);
router.delete("/:id", validate(idParamSchema, "params"), deleteGoal);

export default router;
