import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { formatINR } from "../utils/calculations";
import { AuthenticatedRequest } from "../types/express";
import { Prisma } from "@prisma/client";

// GET /api/expenses
export async function getExpenses(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { category, startDate, endDate, search, page, limit } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ExpenseWhereInput = { userId };

    if (category) {
      where.category = category as any;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string);
      }
    }

    if (search) {
      where.description = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.expense.count({ where }),
    ]);

    const formattedExpenses = expenses.map((e) => ({
      ...e,
      amountFormatted: formatINR(e.amount),
      amount: Number(e.amount),
    }));

    res.json({
      success: true,
      data: {
        expenses: formattedExpenses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/expenses
export async function createExpense(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { amount, category, description, date, receiptUrl } = req.body;

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount,
        category,
        description,
        date: new Date(date),
        receiptUrl: receiptUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        expense: {
          ...expense,
          amountFormatted: formatINR(expense.amount),
          amount: Number(expense.amount),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/expenses/:id
export async function updateExpense(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    // Verify ownership
    const existing = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Expense not found", 404);
    }

    const updateData: Prisma.ExpenseUpdateInput = {};
    if (req.body.amount !== undefined) updateData.amount = req.body.amount;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
    if (req.body.receiptUrl !== undefined) updateData.receiptUrl = req.body.receiptUrl;

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        expense: {
          ...expense,
          amountFormatted: formatINR(expense.amount),
          amount: Number(expense.amount),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);
    const existing = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Expense not found", 404);
    }

    await prisma.expense.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: "Expense deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/expenses/summary
export async function getExpenseSummary(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    // Current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { amount: true, category: true },
    });

    // Group by category
    const categoryTotals: Record<string, number> = {};
    let grandTotal = 0;

    for (const expense of expenses) {
      const amount = Number(expense.amount);
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + amount;
      grandTotal += amount;
    }

    // Build breakdown with percentages
    const breakdown = Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        total: Math.round(total * 100) / 100,
        totalFormatted: formatINR(total),
        percentage:
          grandTotal > 0
            ? Math.round((total / grandTotal) * 10000) / 100
            : 0,
      }))
      .sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      data: {
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        grandTotal: Math.round(grandTotal * 100) / 100,
        grandTotalFormatted: formatINR(grandTotal),
        breakdown,
        transactionCount: expenses.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/expenses/trends
export async function getExpenseTrends(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    // Last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: twelveMonthsAgo },
      },
      select: { amount: true, date: true },
      orderBy: { date: "asc" },
    });

    // Initialize all 12 months
    const monthlyTotals: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyTotals[key] = 0;
    }

    for (const expense of expenses) {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (key in monthlyTotals) {
        monthlyTotals[key] += Number(expense.amount);
      }
    }

    const trends = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total: Math.round(total * 100) / 100,
      totalFormatted: formatINR(total),
    }));

    // Calculate average
    const nonZeroMonths = trends.filter((t) => t.total > 0);
    const average =
      nonZeroMonths.length > 0
        ? nonZeroMonths.reduce((sum, t) => sum + t.total, 0) /
          nonZeroMonths.length
        : 0;

    res.json({
      success: true,
      data: {
        trends,
        average: Math.round(average * 100) / 100,
        averageFormatted: formatINR(average),
      },
    });
  } catch (error) {
    next(error);
  }
}
