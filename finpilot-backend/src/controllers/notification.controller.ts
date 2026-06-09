import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthenticatedRequest } from "../types/express";

// GET /api/notifications
export async function getNotifications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/notifications/:id/read
export async function markAsRead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
  const id = String(req.params.id);

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({
      success: true,
      data: { notification: updated },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/notifications/read-all
export async function markAllAsRead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({
      success: true,
      data: {
        message: `${result.count} notification(s) marked as read`,
        count: result.count,
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/notifications/:id
export async function deleteNotification(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    await prisma.notification.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: "Notification deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}
