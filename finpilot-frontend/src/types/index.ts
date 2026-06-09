export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  provider?: "EMAIL" | "GOOGLE";
  emailVerified?: boolean;
  createdAt: string;
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  emergencyFund: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type?: "expense" | "income";
  createdAt?: string;
}

export type ExpenseCategory =
  | "FOOD" | "TRAVEL" | "RENT" | "SHOPPING"
  | "BILLS" | "EDUCATION" | "HEALTH" | "OTHER"
  | "food" | "travel" | "rent" | "shopping" | "bills" | "education" | "health" | "other"
  | "entertainment" | "salary" | "freelance" | "investment";

export interface Goal {
  id: string;
  name: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution?: number;
  createdAt: string;
  icon?: string;
}

export type GoalType =
  | "HOUSE" | "CAR" | "TRIP" | "MARRIAGE"
  | "EDUCATION" | "EMERGENCY" | "RETIREMENT" | "CUSTOM"
  | "house" | "car" | "trip" | "marriage" | "education" | "emergency" | "retirement" | "custom";

export interface Investment {
  id: string;
  type: string;
  name: string;
  amountInvested: number;
  currentValue: number;
  units: number;
  purchaseDate: string;
  createdAt?: string;
}

export type InvestmentType = "STOCKS" | "MUTUAL_FUNDS" | "ETFS" | "GOLD" | "CRYPTO"
  | "stocks" | "mutual_funds" | "etf" | "gold" | "crypto" | "ppf" | "fd";

export interface Budget {
  id: string;
  month: string;
  income: number;
  needsLimit: number;
  wantsLimit: number;
  savingsLimit: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface RoadmapMilestone {
  age: number;
  title: string;
  description: string;
  target?: number;
  completed?: boolean;
  icon?: string;
}
