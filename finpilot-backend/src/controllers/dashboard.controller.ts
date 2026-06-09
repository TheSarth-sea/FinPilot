import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { calculateHealthScore, formatINR } from "../utils/calculations";
import { AuthenticatedRequest } from "../types/express";

// GET /api/dashboard/summary
export async function getSummary(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    // Fetch financial profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Financial profile not found. Please set up your profile first.", 404);
    }

    // Get current month's expenses total
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyExpensesAgg = await prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Get total investments current value
    const investmentsAgg = await prisma.investment.aggregate({
      where: { userId },
      _sum: { currentValue: true, amountInvested: true },
      _count: true,
    });

    // Get active goals count
    const activeGoals = await prisma.goal.count({
      where: {
        userId,
        deadline: { gt: new Date() },
      },
    });

    // Get unread notifications count
    const unreadNotifications = await prisma.notification.count({
      where: { userId, read: false },
    });

    const monthlySpent = Number(monthlyExpensesAgg._sum.amount || 0);
    const monthlyIncome = Number(profile.monthlyIncome);
    const remainingBudget = monthlyIncome - monthlySpent;

    res.json({
      success: true,
      data: {
        monthlyIncome: formatINR(monthlyIncome),
        monthlyIncomeRaw: monthlyIncome,
        monthlyExpenses: formatINR(monthlySpent),
        monthlyExpensesRaw: monthlySpent,
        remainingBudget: formatINR(remainingBudget),
        remainingBudgetRaw: remainingBudget,
        totalSavings: formatINR(Number(profile.totalSavings)),
        totalSavingsRaw: Number(profile.totalSavings),
        totalInvestments: formatINR(
          Number(investmentsAgg._sum.currentValue || profile.totalInvestments)
        ),
        totalInvestmentsRaw: Number(
          investmentsAgg._sum.currentValue || profile.totalInvestments
        ),
        totalDebts: formatINR(Number(profile.totalDebts)),
        totalDebtsRaw: Number(profile.totalDebts),
        emergencyFund: formatINR(Number(profile.emergencyFund)),
        emergencyFundRaw: Number(profile.emergencyFund),
        activeGoals,
        transactionsThisMonth: monthlyExpensesAgg._count,
        investmentCount: investmentsAgg._count,
        unreadNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/health-score
export async function getHealthScore(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Financial profile not found. Please set up your profile first.", 404);
    }

    const score = calculateHealthScore({
      monthlyIncome: profile.monthlyIncome,
      monthlyExpenses: profile.monthlyExpenses,
      totalSavings: profile.totalSavings,
      totalInvestments: profile.totalInvestments,
      totalDebts: profile.totalDebts,
      emergencyFund: profile.emergencyFund,
    });

    // Generate advice based on score
    const advice: string[] = [];
    if (score.breakdown.savingsRate < 15) {
      advice.push(
        "Try to save at least 20% of your income. Consider the 50-30-20 rule."
      );
    }
    if (score.breakdown.debtRatio < 15) {
      advice.push(
        "Your debt levels are high. Focus on paying off high-interest debt first."
      );
    }
    if (score.breakdown.emergencyFund < 15) {
      advice.push(
        "Build your emergency fund to cover at least 6 months of expenses."
      );
    }
    if (score.breakdown.investmentScore < 15) {
      advice.push(
        "Consider diversifying your investments. Start with mutual funds or index funds."
      );
    }
    if (score.total >= 80) {
      advice.push(
        "Excellent financial health! Consider increasing your investment portfolio."
      );
    }

    let rating: string;
    if (score.total >= 80) rating = "Excellent";
    else if (score.total >= 60) rating = "Good";
    else if (score.total >= 40) rating = "Fair";
    else if (score.total >= 20) rating = "Needs Improvement";
    else rating = "Critical";

    res.json({
      success: true,
      data: {
        score: score.total,
        rating,
        breakdown: score.breakdown,
        advice,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/net-worth
export async function getNetWorth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Financial profile not found.", 404);
    }

    // Aggregate actual investments
    const investmentsAgg = await prisma.investment.aggregate({
      where: { userId },
      _sum: { currentValue: true, amountInvested: true },
    });

    const totalSavings = Number(profile.totalSavings);
    const emergencyFund = Number(profile.emergencyFund);
    const investmentsValue = Number(investmentsAgg._sum.currentValue || 0);
    const totalDebts = Number(profile.totalDebts);

    const totalAssets = totalSavings + emergencyFund + investmentsValue;
    const totalLiabilities = totalDebts;
    const netWorth = totalAssets - totalLiabilities;

    res.json({
      success: true,
      data: {
        netWorth: formatINR(netWorth),
        netWorthRaw: netWorth,
        assets: {
          totalSavings: formatINR(totalSavings),
          emergencyFund: formatINR(emergencyFund),
          investments: formatINR(investmentsValue),
          total: formatINR(totalAssets),
          totalRaw: totalAssets,
        },
        liabilities: {
          totalDebts: formatINR(totalDebts),
          total: formatINR(totalLiabilities),
          totalRaw: totalLiabilities,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/dashboard/trends
export async function getTrends(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    // Get expenses for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: twelveMonthsAgo },
      },
      select: {
        amount: true,
        date: true,
        category: true,
      },
      orderBy: { date: "asc" },
    });

    // Group expenses by month
    const monthlyTotals: Record<
      string,
      { total: number; categories: Record<string, number> }
    > = {};

    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyTotals[key] = { total: 0, categories: {} };
    }

    for (const expense of expenses) {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyTotals[key]) {
        const amount = Number(expense.amount);
        monthlyTotals[key].total += amount;
        monthlyTotals[key].categories[expense.category] =
          (monthlyTotals[key].categories[expense.category] || 0) + amount;
      }
    }

    // Convert to sorted array
    const trends = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        total: Math.round(data.total * 100) / 100,
        totalFormatted: formatINR(data.total),
        categories: data.categories,
      }));

    res.json({
      success: true,
      data: { trends },
    });
  } catch (error) {
    next(error);
  }
}
