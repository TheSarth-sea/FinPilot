// ══════════════════════════════════════════════
// FinPilot — Financial Calculation Engine
// ══════════════════════════════════════════════

/** EMI = P × r × (1+r)^n / ((1+r)^n - 1) */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return { emi: principal / tenureMonths, totalInterest: 0, totalPayment: principal };
  const factor = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * factor) / (factor - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
}

/** Generate amortization schedule */
export function generateAmortization(principal: number, annualRate: number, tenureMonths: number) {
  const r = annualRate / 12 / 100;
  const { emi } = calculateEMI(principal, annualRate, tenureMonths);
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = Math.round(balance * r);
    const principalPart = Math.round(emi - interest);
    balance = Math.max(0, balance - principalPart);
    schedule.push({ month, emi, principal: principalPart, interest, balance });
  }
  return schedule;
}

/** SIP Future Value: FV = P × ((1+r)^n - 1) / r × (1+r) */
export function calculateSIP(monthlyInvestment: number, annualReturn: number, years: number) {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  if (r === 0) return { investedAmount: monthlyInvestment * n, futureValue: monthlyInvestment * n, wealthGained: 0 };
  const futureValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const investedAmount = monthlyInvestment * n;
  const wealthGained = futureValue - investedAmount;
  return { investedAmount: Math.round(investedAmount), futureValue: Math.round(futureValue), wealthGained: Math.round(wealthGained) };
}

/** Generate SIP growth data year by year */
export function generateSIPGrowth(monthlyInvestment: number, annualReturn: number, years: number) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const result = calculateSIP(monthlyInvestment, annualReturn, y);
    data.push({ year: y, invested: result.investedAmount, value: result.futureValue });
  }
  return data;
}

/** Lumpsum FV = PV × (1 + r/100)^n */
export function calculateLumpsum(principal: number, annualReturn: number, years: number) {
  const futureValue = principal * Math.pow(1 + annualReturn / 100, years);
  return { investedAmount: principal, futureValue: Math.round(futureValue), wealthGained: Math.round(futureValue - principal) };
}

/** Compounding frequency type used by calculator pages */
export type CompoundingFrequency = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

const FREQ_MAP: Record<string, number> = {
  monthly: 12, quarterly: 4, 'half-yearly': 2, yearly: 1,
};

/** Compound Interest with frequency (accepts number or string) */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number | CompoundingFrequency = 12
) {
  const freq = typeof frequency === 'string' ? (FREQ_MAP[frequency] || 12) : frequency;
  const amount = principal * Math.pow(1 + annualRate / 100 / freq, freq * years);
  return {
    principal,
    amount: Math.round(amount),
    interest: Math.round(amount - principal),
    finalAmount: Math.round(amount),
    totalInterest: Math.round(amount - principal),
  };
}

/** Retirement corpus calculation */
export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number,
  currentSavings: number,
  monthlySIP: number,
  expectedReturn: number
) {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = 85 - retirementAge;
  const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const realReturn = ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1);
  const monthlyRealReturn = realReturn / 12;
  const retirementMonths = yearsInRetirement * 12;
  const requiredCorpus = futureMonthlyExpenses * ((1 - Math.pow(1 + monthlyRealReturn, -retirementMonths)) / monthlyRealReturn);
  const projectedFromSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
  const projectedFromSIP = calculateSIP(monthlySIP, expectedReturn, yearsToRetirement).futureValue;
  const projectedCorpus = projectedFromSavings + projectedFromSIP;
  const gap = requiredCorpus - projectedCorpus;
  const r = expectedReturn / 100 / 12;
  const n = yearsToRetirement * 12;
  const additionalMonthlySIPNeeded = gap > 0 ? gap / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)) : 0;

  return {
    yearsToRetirement,
    futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
    monthlyExpensesAtRetirement: Math.round(futureMonthlyExpenses),
    requiredCorpus: Math.round(requiredCorpus),
    projectedCorpus: Math.round(projectedCorpus),
    futureValueOfCurrentSavings: Math.round(projectedFromSavings),
    futureValueOfSIP: Math.round(projectedFromSIP),
    totalAccumulated: Math.round(projectedCorpus),
    gap: Math.round(Math.max(0, gap)),
    additionalMonthlySIPNeeded: Math.round(Math.max(0, additionalMonthlySIPNeeded)),
    additionalMonthlySavingNeeded: Math.round(Math.max(0, additionalMonthlySIPNeeded)),
    isOnTrack: projectedCorpus >= requiredCorpus,
  };
}

/** Inflation adjusted future value */
export function calculateInflation(currentAmount: number, inflationRate: number, years: number) {
  const futureEquivalent = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
  return {
    currentAmount,
    futureEquivalent: Math.round(futureEquivalent),
    purchasingPower: Math.round(purchasingPower),
    lossPercent: Math.round((1 - purchasingPower / currentAmount) * 100),
  };
}

/** Home affordability */
export function calculateHomeAffordability(
  monthlyIncome: number, monthlyExpenses: number, downPayment: number, interestRate: number, tenureYears: number
) {
  const netIncome = monthlyIncome - monthlyExpenses;
  const maxEMI = netIncome * 0.4;
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const maxLoan = r > 0 ? maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : maxEMI * n;
  const maxHomePrice = maxLoan + downPayment;
  return { maxEMI: Math.round(maxEMI), maxLoan: Math.round(maxLoan), maxHomePrice: Math.round(maxHomePrice), downPayment, totalCost: Math.round(maxEMI * n + downPayment) };
}

/** Car affordability */
export function calculateCarAffordability(
  monthlyIncome: number, monthlyExpenses: number, downPayment: number, interestRate: number, tenureYears: number
) {
  const netIncome = monthlyIncome - monthlyExpenses;
  const maxEMI = netIncome * 0.15;
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const maxLoan = r > 0 ? maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : maxEMI * n;
  const maxCarPrice = maxLoan + downPayment;
  const insuranceEstimate = Math.round(maxCarPrice * 0.03);
  return { maxEMI: Math.round(maxEMI), maxLoan: Math.round(maxLoan), maxCarPrice: Math.round(maxCarPrice), insuranceEstimate, totalOwnershipCost: Math.round(maxEMI * n + downPayment + insuranceEstimate * tenureYears) };
}

/** Debt payoff */
export interface Debt {
  id: string; name: string; balance: number; rate: number; minPayment: number;
}

export function calculateDebtPayoff(debts: Debt[], extraPayment: number = 0) {
  const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);
  const monthlyBudget = totalMinPayment + extraPayment;

  function simulate(sorted: Debt[]) {
    const balances = sorted.map((d) => ({ ...d, remaining: d.balance }));
    let months = 0;
    let totalInterest = 0;
    const timeline: { month: number; totalRemaining: number }[] = [];

    while (balances.some((d) => d.remaining > 0) && months < 600) {
      months++;
      let available = monthlyBudget;
      for (const debt of balances) {
        if (debt.remaining <= 0) continue;
        const interest = debt.remaining * (debt.rate / 100 / 12);
        totalInterest += interest;
        debt.remaining += interest;
      }
      for (const debt of balances) {
        if (debt.remaining <= 0) continue;
        const payment = Math.min(debt.minPayment, debt.remaining);
        debt.remaining -= payment;
        available -= payment;
      }
      for (const debt of balances) {
        if (debt.remaining <= 0 || available <= 0) continue;
        const payment = Math.min(available, debt.remaining);
        debt.remaining -= payment;
        available -= payment;
        break;
      }
      timeline.push({ month: months, totalRemaining: Math.round(balances.reduce((s, d) => s + Math.max(0, d.remaining), 0)) });
    }
    return { months, totalInterest: Math.round(totalInterest), timeline };
  }

  const snowball = simulate([...debts].sort((a, b) => a.balance - b.balance));
  const avalanche = simulate([...debts].sort((a, b) => b.rate - a.rate));
  return { snowball, avalanche, totalDebt: debts.reduce((s, d) => s + d.balance, 0) };
}

// ── Aliases for subagent-created calculator pages ──────

/** Re-export formatINR so pages importing from @/lib/calculators work */
export { formatINR } from "@/lib/utils";

/** Alias for generateAmortization — accepts tenure in years */
export function generateAmortizationSchedule(principal: number, annualRate: number, tenureYears: number) {
  return generateAmortization(principal, annualRate, tenureYears * 12);
}

/** Alias: generateSIPGrowthData → generateSIPGrowth */
export const generateSIPGrowthData = generateSIPGrowth;

/** Generate lumpsum growth data year by year */
export function generateLumpsumGrowthData(principal: number, annualReturn: number, years: number) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const result = calculateLumpsum(principal, annualReturn, y);
    data.push({ year: y, invested: principal, value: result.futureValue });
  }
  return data;
}

/** Generate inflation data year by year */
export function generateInflationData(currentAmount: number, inflationRate: number, years: number) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const result = calculateInflation(currentAmount, inflationRate, y);
    data.push({ year: y, futureEquivalent: result.futureEquivalent, purchasingPower: result.purchasingPower });
  }
  return data;
}

/** Generate compound interest comparison data */
export function generateCompoundInterestData(principal: number, annualRate: number, years: number, frequency: number = 12) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const result = calculateCompoundInterest(principal, annualRate, y, frequency);
    data.push({ year: y, amount: result.amount, interest: result.interest, principal });
  }
  return data;
}

/** Generate compound interest growth data comparing all frequencies */
export function generateCompoundGrowthData(principal: number, annualRate: number, years: number) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    data.push({
      year: y,
      monthly: calculateCompoundInterest(principal, annualRate, y, 12).finalAmount,
      quarterly: calculateCompoundInterest(principal, annualRate, y, 4).finalAmount,
      halfYearly: calculateCompoundInterest(principal, annualRate, y, 2).finalAmount,
      yearly: calculateCompoundInterest(principal, annualRate, y, 1).finalAmount,
    });
  }
  return data;
}

/** Generate retirement projection data */
export function generateRetirementProjection(
  currentAge: number, retirementAge: number, currentSavings: number,
  monthlySIP: number, expectedReturn: number
) {
  const data = [];
  for (let age = currentAge; age <= retirementAge; age++) {
    const years = age - currentAge;
    const fromSavings = currentSavings * Math.pow(1 + expectedReturn / 100, years);
    const fromSIP = years > 0 ? calculateSIP(monthlySIP, expectedReturn, years).futureValue : 0;
    data.push({ age, corpus: Math.round(fromSavings + fromSIP) });
  }
  return data;
}

/** Generate EMI breakdown data */
export function generateEMIBreakdown(principal: number, annualRate: number, tenureMonths: number) {
  const { emi, totalInterest } = calculateEMI(principal, annualRate, tenureMonths);
  return { emi, principal, totalInterest, totalPayment: principal + totalInterest };
}

/** Generate home affordability breakdown */
export function generateHomeAffordabilityData(
  monthlyIncome: number, monthlyExpenses: number, downPayment: number,
  interestRate: number, tenureYears: number
) {
  return calculateHomeAffordability(monthlyIncome, monthlyExpenses, downPayment, interestRate, tenureYears);
}
