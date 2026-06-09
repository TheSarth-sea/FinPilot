import { Router } from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenseTrends,
} from "../controllers/expense.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
  idParamSchema,
} from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.get("/summary", getExpenseSummary);
router.get("/trends", getExpenseTrends);
router.get("/", validate(expenseQuerySchema, "query"), getExpenses);
router.post("/", validate(createExpenseSchema), createExpense);
router.put("/:id", validate(idParamSchema, "params"), validate(updateExpenseSchema), updateExpense);
router.delete("/:id", validate(idParamSchema, "params"), deleteExpense);

export default router;
