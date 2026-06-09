import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { formatINR } from "../utils/calculations";
import { AuthenticatedRequest } from "../types/express";

// GET /api/goals
export async function getGoals(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: "asc" },
    });

    const formattedGoals = goals.map((goal) => {
      const target = Number(goal.targetAmount);
      const current = Number(goal.currentAmount);
      const progress = target > 0 ? Math.round((current / target) * 10000) / 100 : 0;

      return {
        ...goal,
        targetAmount: target,
        currentAmount: current,
        monthlyContribution: Number(goal.monthlyContribution),
        targetAmountFormatted: formatINR(target),
        currentAmountFormatted: formatINR(current),
        monthlyContributionFormatted: formatINR(goal.monthlyContribution),
        progress,
      };
    });

    res.json({
      success: true,
      data: { goals: formattedGoals },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/goals
export async function createGoal(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { name, type, targetAmount, currentAmount, deadline, monthlyContribution } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        type,
        targetAmount,
        currentAmount: currentAmount || 0,
        deadline: new Date(deadline),
        monthlyContribution: monthlyContribution || 0,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        goal: {
          ...goal,
          targetAmount: Number(goal.targetAmount),
          currentAmount: Number(goal.currentAmount),
          monthlyContribution: Number(goal.monthlyContribution),
          targetAmountFormatted: formatINR(goal.targetAmount),
          currentAmountFormatted: formatINR(goal.currentAmount),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/goals/:id
export async function updateGoal(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Goal not found", 404);
    }

    const updateData: Record<string, any> = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.type !== undefined) updateData.type = req.body.type;
    if (req.body.targetAmount !== undefined) updateData.targetAmount = req.body.targetAmount;
    if (req.body.currentAmount !== undefined) updateData.currentAmount = req.body.currentAmount;
    if (req.body.deadline !== undefined) updateData.deadline = new Date(req.body.deadline);
    if (req.body.monthlyContribution !== undefined) updateData.monthlyContribution = req.body.monthlyContribution;

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        goal: {
          ...goal,
          targetAmount: Number(goal.targetAmount),
          currentAmount: Number(goal.currentAmount),
          monthlyContribution: Number(goal.monthlyContribution),
          targetAmountFormatted: formatINR(goal.targetAmount),
          currentAmountFormatted: formatINR(goal.currentAmount),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/goals/:id
export async function deleteGoal(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Goal not found", 404);
    }

    await prisma.goal.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: "Goal deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/goals/predictions
export async function getGoalPredictions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: "asc" },
    });

    const predictions = goals.map((goal) => {
      const target = Number(goal.targetAmount);
      const current = Number(goal.currentAmount);
      const monthly = Number(goal.monthlyContribution);
      const remaining = target - current;
      const now = new Date();
      const deadline = new Date(goal.deadline);

      // Months remaining until deadline
      const monthsRemaining =
        (deadline.getFullYear() - now.getFullYear()) * 12 +
        (deadline.getMonth() - now.getMonth());

      // Monthly contribution needed to reach target by deadline
      const monthlyNeeded =
        monthsRemaining > 0 ? remaining / monthsRemaining : remaining;

      // Projected completion date at current contribution rate
      let projectedCompletionDate: Date | null = null;
      let projectedMonths: number | null = null;
      if (monthly > 0 && remaining > 0) {
        projectedMonths = Math.ceil(remaining / monthly);
        projectedCompletionDate = new Date();
        projectedCompletionDate.setMonth(
          projectedCompletionDate.getMonth() + projectedMonths
        );
      } else if (remaining <= 0) {
        projectedCompletionDate = now;
        projectedMonths = 0;
      }

      // On-track status
      let status: "ON_TRACK" | "BEHIND" | "AHEAD" | "COMPLETED" | "AT_RISK";
      const progress = target > 0 ? (current / target) * 100 : 0;

      if (remaining <= 0) {
        status = "COMPLETED";
      } else if (monthly <= 0) {
        status = "AT_RISK";
      } else if (monthly >= monthlyNeeded * 1.1) {
        status = "AHEAD";
      } else if (monthly >= monthlyNeeded * 0.9) {
        status = "ON_TRACK";
      } else {
        status = "BEHIND";
      }

      return {
        goalId: goal.id,
        name: goal.name,
        type: goal.type,
        targetAmount: target,
        currentAmount: current,
        remaining: Math.max(0, remaining),
        remainingFormatted: formatINR(Math.max(0, remaining)),
        progress: Math.round(progress * 100) / 100,
        monthlyContribution: monthly,
        monthlyContributionFormatted: formatINR(monthly),
        monthlyNeeded: Math.round(monthlyNeeded * 100) / 100,
        monthlyNeededFormatted: formatINR(Math.max(0, monthlyNeeded)),
        deadline: goal.deadline,
        monthsRemaining: Math.max(0, monthsRemaining),
        projectedCompletionDate,
        projectedMonths,
        status,
      };
    });

    res.json({
      success: true,
      data: { predictions },
    });
  } catch (error) {
    next(error);
  }
}
