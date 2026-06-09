import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { formatINR, calculateCAGR } from "../utils/calculations";
import { AuthenticatedRequest } from "../types/express";

// GET /api/investments
export async function getInvestments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const formattedInvestments = investments.map((inv) => {
      const invested = Number(inv.amountInvested);
      const current = Number(inv.currentValue);
      const absoluteReturn = current - invested;
      const returnPct = invested > 0 ? ((current - invested) / invested) * 100 : 0;

      return {
        ...inv,
        amountInvested: invested,
        currentValue: current,
        units: Number(inv.units),
        amountInvestedFormatted: formatINR(invested),
        currentValueFormatted: formatINR(current),
        absoluteReturn: Math.round(absoluteReturn * 100) / 100,
        absoluteReturnFormatted: formatINR(absoluteReturn),
        returnPercentage: Math.round(returnPct * 100) / 100,
      };
    });

    res.json({
      success: true,
      data: { investments: formattedInvestments },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/investments
export async function createInvestment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { type, name, amountInvested, currentValue, units, purchaseDate } = req.body;

    const investment = await prisma.investment.create({
      data: {
        userId,
        type,
        name,
        amountInvested,
        currentValue,
        units: units || 0,
        purchaseDate: new Date(purchaseDate),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        investment: {
          ...investment,
          amountInvested: Number(investment.amountInvested),
          currentValue: Number(investment.currentValue),
          units: Number(investment.units),
          amountInvestedFormatted: formatINR(investment.amountInvested),
          currentValueFormatted: formatINR(investment.currentValue),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/investments/:id
export async function updateInvestment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Investment not found", 404);
    }

    const updateData: Record<string, any> = {};
    if (req.body.type !== undefined) updateData.type = req.body.type;
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.amountInvested !== undefined) updateData.amountInvested = req.body.amountInvested;
    if (req.body.currentValue !== undefined) updateData.currentValue = req.body.currentValue;
    if (req.body.units !== undefined) updateData.units = req.body.units;
    if (req.body.purchaseDate !== undefined) updateData.purchaseDate = new Date(req.body.purchaseDate);

    const investment = await prisma.investment.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        investment: {
          ...investment,
          amountInvested: Number(investment.amountInvested),
          currentValue: Number(investment.currentValue),
          units: Number(investment.units),
          amountInvestedFormatted: formatINR(investment.amountInvested),
          currentValueFormatted: formatINR(investment.currentValue),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/investments/:id
export async function deleteInvestment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Investment not found", 404);
    }

    await prisma.investment.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: "Investment deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/investments/portfolio
export async function getPortfolio(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const investments = await prisma.investment.findMany({
      where: { userId },
    });

    // Aggregate by type
    const typeGroups: Record<
      string,
      { totalInvested: number; currentValue: number; count: number }
    > = {};

    let grandTotalInvested = 0;
    let grandTotalCurrent = 0;

    for (const inv of investments) {
      const invested = Number(inv.amountInvested);
      const current = Number(inv.currentValue);
      const type = inv.type;

      if (!typeGroups[type]) {
        typeGroups[type] = { totalInvested: 0, currentValue: 0, count: 0 };
      }

      typeGroups[type].totalInvested += invested;
      typeGroups[type].currentValue += current;
      typeGroups[type].count += 1;
      grandTotalInvested += invested;
      grandTotalCurrent += current;
    }

    const portfolio = Object.entries(typeGroups).map(([type, data]) => ({
      type,
      totalInvested: Math.round(data.totalInvested * 100) / 100,
      totalInvestedFormatted: formatINR(data.totalInvested),
      currentValue: Math.round(data.currentValue * 100) / 100,
      currentValueFormatted: formatINR(data.currentValue),
      absoluteReturn: Math.round((data.currentValue - data.totalInvested) * 100) / 100,
      absoluteReturnFormatted: formatINR(data.currentValue - data.totalInvested),
      returnPercentage:
        data.totalInvested > 0
          ? Math.round(
              ((data.currentValue - data.totalInvested) / data.totalInvested) *
                10000
            ) / 100
          : 0,
      allocation:
        grandTotalCurrent > 0
          ? Math.round((data.currentValue / grandTotalCurrent) * 10000) / 100
          : 0,
      count: data.count,
    }));

    const totalReturn = grandTotalCurrent - grandTotalInvested;

    res.json({
      success: true,
      data: {
        portfolio,
        summary: {
          totalInvested: Math.round(grandTotalInvested * 100) / 100,
          totalInvestedFormatted: formatINR(grandTotalInvested),
          currentValue: Math.round(grandTotalCurrent * 100) / 100,
          currentValueFormatted: formatINR(grandTotalCurrent),
          totalReturn: Math.round(totalReturn * 100) / 100,
          totalReturnFormatted: formatINR(totalReturn),
          totalReturnPercentage:
            grandTotalInvested > 0
              ? Math.round((totalReturn / grandTotalInvested) * 10000) / 100
              : 0,
          totalHoldings: investments.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/investments/returns
export async function getReturns(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;

    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { purchaseDate: "desc" },
    });

    const now = new Date();

    const returns = investments.map((inv) => {
      const invested = Number(inv.amountInvested);
      const current = Number(inv.currentValue);
      const purchaseDate = new Date(inv.purchaseDate);
      const absoluteReturn = current - invested;
      const returnPct = invested > 0 ? ((current - invested) / invested) * 100 : 0;

      // Calculate CAGR
      const yearsHeld =
        (now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const cagr = yearsHeld >= 1 ? calculateCAGR(invested, current, yearsHeld) : null;

      return {
        id: inv.id,
        name: inv.name,
        type: inv.type,
        amountInvested: invested,
        amountInvestedFormatted: formatINR(invested),
        currentValue: current,
        currentValueFormatted: formatINR(current),
        absoluteReturn: Math.round(absoluteReturn * 100) / 100,
        absoluteReturnFormatted: formatINR(absoluteReturn),
        returnPercentage: Math.round(returnPct * 100) / 100,
        cagr: cagr !== null ? Math.round(cagr * 100) / 100 : null,
        purchaseDate: inv.purchaseDate,
        yearsHeld: Math.round(yearsHeld * 100) / 100,
      };
    });

    res.json({
      success: true,
      data: { returns },
    });
  } catch (error) {
    next(error);
  }
}
