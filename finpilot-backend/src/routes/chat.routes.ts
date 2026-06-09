import { Router } from "express";
import { sendMessage, getChatHistory } from "../controllers/chat.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { chatMessageSchema } from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.post("/message", validate(chatMessageSchema), sendMessage);
router.get("/history", getChatHistory);

export default router;
