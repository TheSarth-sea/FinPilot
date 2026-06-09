import { Router } from "express";
import {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getPortfolio,
  getReturns,
} from "../controllers/investment.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createInvestmentSchema,
  updateInvestmentSchema,
  idParamSchema,
} from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.get("/portfolio", getPortfolio);
router.get("/returns", getReturns);
router.get("/", getInvestments);
router.post("/", validate(createInvestmentSchema), createInvestment);
router.put("/:id", validate(idParamSchema, "params"), validate(updateInvestmentSchema), updateInvestment);
router.delete("/:id", validate(idParamSchema, "params"), deleteInvestment);

export default router;
