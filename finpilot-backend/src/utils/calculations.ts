import { Decimal } from "@prisma/client/runtime/library";

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (annualRate === 0) return principal / tenureMonths;
  const monthlyRate = annualRate / 12 / 100;
  const power = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * power) / (power - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Calculate SIP (Systematic Investment Plan) future value
 * Formula: FV = P × [((1+r)^n - 1) / r] × (1+r)
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return monthlyInvestment * months;
  const futureValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);
  return Math.round(futureValue * 100) / 100;
}

/**
 * Calculate compound interest
 * Formula: A = P(1 + r/n)^(nt)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number = 12
): number {
  const rate = annualRate / 100;
  const amount =
    principal * Math.pow(1 + rate / frequency, frequency * years);
  return Math.round(amount * 100) / 100;
}

/**
 * Calculate financial health score (0-100)
 * Components:
 *   - Savings rate (25 pts): (income - expenses) / income
 *   - Debt ratio (25 pts): lower debt-to-income = higher score
 *   - Emergency fund (25 pts): months of expenses covered
 *   - Investment diversification (25 pts): based on total investments vs income
 */
export function calculateHealthScore(profile: {
  monthlyIncome: Decimal | number;
  monthlyExpenses: Decimal | number;
  totalSavings: Decimal | number;
  totalInvestments: Decimal | number;
  totalDebts: Decimal | number;
  emergencyFund: Decimal | number;
}): {
  total: number;
  breakdown: {
    savingsRate: number;
    debtRatio: number;
    emergencyFund: number;
    investmentScore: number;
  };
} {
  const income = Number(profile.monthlyIncome);
  const expenses = Number(profile.monthlyExpenses);
  const savings = Number(profile.totalSavings);
  const investments = Number(profile.totalInvestments);
  const debts = Number(profile.totalDebts);
  const emergency = Number(profile.emergencyFund);

  // 1. Savings Rate Score (25 pts) - target 20%+ savings rate
  let savingsRateScore = 0;
  if (income > 0) {
    const savingsRate = (income - expenses) / income;
    if (savingsRate >= 0.3) savingsRateScore = 25;
    else if (savingsRate >= 0.2) savingsRateScore = 20;
    else if (savingsRate >= 0.1) savingsRateScore = 15;
    else if (savingsRate >= 0.05) savingsRateScore = 10;
    else if (savingsRate > 0) savingsRateScore = 5;
  }

  // 2. Debt Ratio Score (25 pts) - lower is better
  let debtRatioScore = 25;
  if (income > 0) {
    const debtToIncome = debts / (income * 12);
    if (debtToIncome > 5) debtRatioScore = 0;
    else if (debtToIncome > 3) debtRatioScore = 5;
    else if (debtToIncome > 2) debtRatioScore = 10;
    else if (debtToIncome > 1) debtRatioScore = 15;
    else if (debtToIncome > 0.5) debtRatioScore = 20;
    else debtRatioScore = 25;
  } else if (debts > 0) {
    debtRatioScore = 0;
  }

  // 3. Emergency Fund Score (25 pts) - target 6+ months of expenses
  let emergencyFundScore = 0;
  if (expenses > 0) {
    const monthsCovered = emergency / expenses;
    if (monthsCovered >= 6) emergencyFundScore = 25;
    else if (monthsCovered >= 4) emergencyFundScore = 20;
    else if (monthsCovered >= 3) emergencyFundScore = 15;
    else if (monthsCovered >= 2) emergencyFundScore = 10;
    else if (monthsCovered >= 1) emergencyFundScore = 5;
  } else if (emergency > 0) {
    emergencyFundScore = 25;
  }

  // 4. Investment Score (25 pts) - investments relative to annual income
  let investmentScore = 0;
  if (income > 0) {
    const investmentRatio = investments / (income * 12);
    if (investmentRatio >= 3) investmentScore = 25;
    else if (investmentRatio >= 2) investmentScore = 20;
    else if (investmentRatio >= 1) investmentScore = 15;
    else if (investmentRatio >= 0.5) investmentScore = 10;
    else if (investmentRatio > 0) investmentScore = 5;
  } else if (investments > 0) {
    investmentScore = 15;
  }

  const total =
    savingsRateScore + debtRatioScore + emergencyFundScore + investmentScore;

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown: {
      savingsRate: savingsRateScore,
      debtRatio: debtRatioScore,
      emergencyFund: emergencyFundScore,
      investmentScore,
    },
  };
}

/**
 * Format a number as INR currency string
 */
export function formatINR(amount: number | Decimal): string {
  const num = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * Formula: CAGR = (EndValue/BeginValue)^(1/years) - 1
 */
export function calculateCAGR(
  beginValue: number,
  endValue: number,
  years: number
): number {
  if (beginValue <= 0 || years <= 0) return 0;
  const cagr = Math.pow(endValue / beginValue, 1 / years) - 1;
  return Math.round(cagr * 10000) / 100; // return as percentage
}
