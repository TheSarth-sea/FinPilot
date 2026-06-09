import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { idParamSchema } from "../validators/financial.validator";

const router = Router();

router.use(verifyToken);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", validate(idParamSchema, "params"), markAsRead);
router.delete("/:id", validate(idParamSchema, "params"), deleteNotification);

export default router;
