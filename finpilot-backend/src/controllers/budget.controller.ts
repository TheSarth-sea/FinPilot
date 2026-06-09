import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { formatINR } from "../utils/calculations";
import { AuthenticatedRequest } from "../types/express";

// Categorize expenses into needs, wants, or savings
const NEEDS_CATEGORIES = ["RENT", "BILLS", "HEALTH", "EDUCATION"];
const WANTS_CATEGORIES = ["FOOD", "TRAVEL", "SHOPPING", "OTHER"];

function categorizeExpense(category: string): "needs" | "wants" {
  if (NEEDS_CATEGORIES.includes(category)) return "needs";
  return "wants";
}

// GET /api/budget (current month)
export async function getCurrentBudget(
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

    // Find budget for current month
    const budget = await prisma.budget.findUnique({
      where: {
        userId_month: {
          userId,
          month: startOfMonth,
        },
      },
    });

    // Get actual expenses for the month
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { amount: true, category: true },
    });

    let actualNeeds = 0;
    let actualWants = 0;
    let totalSpent = 0;

    for (const expense of expenses) {
      const amount = Number(expense.amount);
      totalSpent += amount;
      const bucket = categorizeExpense(expense.category);
      if (bucket === "needs") actualNeeds += amount;
      else actualWants += amount;
    }

    if (!budget) {
      res.json({
        success: true,
        data: {
          budget: null,
          actual: {
            totalSpent,
            totalSpentFormatted: formatINR(totalSpent),
            needs: actualNeeds,
            needsFormatted: formatINR(actualNeeds),
            wants: actualWants,
            wantsFormatted: formatINR(actualWants),
          },
          message: "No budget set for this month. Create one using POST /api/budget.",
        },
      });
      return;
    }

    const needsLimit = Number(budget.needsLimit);
    const wantsLimit = Number(budget.wantsLimit);
    const savingsLimit = Number(budget.savingsLimit);
    const income = Number(budget.income);
    const actualSavings = income - totalSpent;

    res.json({
      success: true,
      data: {
        budget: {
          ...budget,
          income: income,
          needsLimit,
          wantsLimit,
          savingsLimit,
          incomeFormatted: formatINR(income),
          needsLimitFormatted: formatINR(needsLimit),
          wantsLimitFormatted: formatINR(wantsLimit),
          savingsLimitFormatted: formatINR(savingsLimit),
        },
        actual: {
          totalSpent,
          totalSpentFormatted: formatINR(totalSpent),
          needs: Math.round(actualNeeds * 100) / 100,
          needsFormatted: formatINR(actualNeeds),
          wants: Math.round(actualWants * 100) / 100,
          wantsFormatted: formatINR(actualWants),
          savings: Math.round(actualSavings * 100) / 100,
          savingsFormatted: formatINR(actualSavings),
        },
        comparison: {
          needsRemaining: Math.round((needsLimit - actualNeeds) * 100) / 100,
          needsRemainingFormatted: formatINR(needsLimit - actualNeeds),
          needsUsedPercent: needsLimit > 0 ? Math.round((actualNeeds / needsLimit) * 10000) / 100 : 0,
          wantsRemaining: Math.round((wantsLimit - actualWants) * 100) / 100,
          wantsRemainingFormatted: formatINR(wantsLimit - actualWants),
          wantsUsedPercent: wantsLimit > 0 ? Math.round((actualWants / wantsLimit) * 10000) / 100 : 0,
          savingsAchieved: Math.round(actualSavings * 100) / 100,
          savingsAchievedFormatted: formatINR(actualSavings),
          savingsTargetPercent: savingsLimit > 0 ? Math.round((actualSavings / savingsLimit) * 10000) / 100 : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/budget
export async function createBudget(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { month, income, needsLimit, wantsLimit, savingsLimit } = req.body;

    const monthDate = new Date(month);
    // Normalize to first day of month
    monthDate.setDate(1);
    monthDate.setHours(0, 0, 0, 0);

    // Check if budget already exists for this month
    const existing = await prisma.budget.findUnique({
      where: {
        userId_month: { userId, month: monthDate },
      },
    });

    if (existing) {
      throw new AppError("Budget already exists for this month. Use PUT to update.", 409);
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        month: monthDate,
        income,
        needsLimit,
        wantsLimit,
        savingsLimit,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        budget: {
          ...budget,
          income: Number(budget.income),
          needsLimit: Number(budget.needsLimit),
          wantsLimit: Number(budget.wantsLimit),
          savingsLimit: Number(budget.savingsLimit),
          incomeFormatted: formatINR(budget.income),
          needsLimitFormatted: formatINR(budget.needsLimit),
          wantsLimitFormatted: formatINR(budget.wantsLimit),
          savingsLimitFormatted: formatINR(budget.savingsLimit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/budget/:id
export async function updateBudget(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);;

    const existing = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Budget not found", 404);
    }

    const updateData: Record<string, any> = {};
    if (req.body.income !== undefined) updateData.income = req.body.income;
    if (req.body.needsLimit !== undefined) updateData.needsLimit = req.body.needsLimit;
    if (req.body.wantsLimit !== undefined) updateData.wantsLimit = req.body.wantsLimit;
    if (req.body.savingsLimit !== undefined) updateData.savingsLimit = req.body.savingsLimit;

    const budget = await prisma.budget.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        budget: {
          ...budget,
          income: Number(budget.income),
          needsLimit: Number(budget.needsLimit),
          wantsLimit: Number(budget.wantsLimit),
          savingsLimit: Number(budget.savingsLimit),
          incomeFormatted: formatINR(budget.income),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/budget/recommendations
export async function getBudgetRecommendations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    // Fetch profile for income
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Financial profile not found. Please set up your profile first.", 404);
    }

    const income = Number(profile.monthlyIncome);

    // 50-30-20 rule recommendations
    const recommended = {
      needs: Math.round(income * 0.5 * 100) / 100,
      wants: Math.round(income * 0.3 * 100) / 100,
      savings: Math.round(income * 0.2 * 100) / 100,
    };

    // Get current month's actual spending
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

    let actualNeeds = 0;
    let actualWants = 0;
    let totalSpent = 0;

    for (const expense of expenses) {
      const amount = Number(expense.amount);
      totalSpent += amount;
      if (categorizeExpense(expense.category) === "needs") {
        actualNeeds += amount;
      } else {
        actualWants += amount;
      }
    }

    const actualSavings = income - totalSpent;

    // Generate recommendations
    const recommendations: string[] = [];

    if (income <= 0) {
      recommendations.push(
        "Please update your monthly income in your financial profile to get personalized recommendations."
      );
    } else {
      // Needs analysis
      if (actualNeeds > recommended.needs) {
        const excess = actualNeeds - recommended.needs;
        recommendations.push(
          `Your essential spending (₹${Math.round(actualNeeds).toLocaleString("en-IN")}) exceeds the recommended 50% limit (₹${Math.round(recommended.needs).toLocaleString("en-IN")}) by ${formatINR(excess)}. Review your rent, bills, and insurance costs.`
        );
      } else {
        recommendations.push(
          `Great! Your essential spending is within the recommended 50% limit. You're spending ₹${Math.round(recommended.needs - actualNeeds).toLocaleString("en-IN")} less than the limit.`
        );
      }

      // Wants analysis
      if (actualWants > recommended.wants) {
        const excess = actualWants - recommended.wants;
        recommendations.push(
          `Your discretionary spending (₹${Math.round(actualWants).toLocaleString("en-IN")}) exceeds the recommended 30% limit (₹${Math.round(recommended.wants).toLocaleString("en-IN")}) by ${formatINR(excess)}. Consider cutting back on dining out, shopping, or entertainment.`
        );
      } else {
        recommendations.push(
          `Your discretionary spending is within the recommended 30% limit. Good job!`
        );
      }

      // Savings analysis
      if (actualSavings < recommended.savings) {
        recommendations.push(
          `You're saving ₹${Math.round(actualSavings).toLocaleString("en-IN")} this month, which is below the recommended 20% target of ${formatINR(recommended.savings)}. Try automating your savings with a SIP.`
        );
      } else {
        recommendations.push(
          `Excellent! You're saving ₹${Math.round(actualSavings).toLocaleString("en-IN")} this month, exceeding the 20% target. Consider investing the surplus.`
        );
      }

      // Additional tips
      if (Number(profile.emergencyFund) < income * 6) {
        recommendations.push(
          `Build your emergency fund to at least ${formatINR(income * 6)} (6 months of income). Current: ${formatINR(profile.emergencyFund)}.`
        );
      }

      if (Number(profile.totalDebts) > income * 12) {
        recommendations.push(
          `Your total debt is more than your annual income. Prioritize paying off high-interest loans.`
        );
      }
    }

    res.json({
      success: true,
      data: {
        rule: "50-30-20",
        income: income,
        incomeFormatted: formatINR(income),
        recommended: {
          needs: recommended.needs,
          needsFormatted: formatINR(recommended.needs),
          wants: recommended.wants,
          wantsFormatted: formatINR(recommended.wants),
          savings: recommended.savings,
          savingsFormatted: formatINR(recommended.savings),
        },
        actual: {
          needs: Math.round(actualNeeds * 100) / 100,
          needsFormatted: formatINR(actualNeeds),
          wants: Math.round(actualWants * 100) / 100,
          wantsFormatted: formatINR(actualWants),
          savings: Math.round(actualSavings * 100) / 100,
          savingsFormatted: formatINR(actualSavings),
          totalSpent: Math.round(totalSpent * 100) / 100,
          totalSpentFormatted: formatINR(totalSpent),
        },
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
}
