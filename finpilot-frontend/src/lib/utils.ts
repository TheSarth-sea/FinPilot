import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatINR(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return formatDateShort(date);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function calculateHealthScore(profile: {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebts: number;
  emergencyFund: number;
  totalInvestments: number;
}): {
  total: number;
  savingsRate: number;
  debtRatio: number;
  emergencyScore: number;
  investmentScore: number;
} {
  const { monthlyIncome, monthlyExpenses, totalDebts, emergencyFund, totalInvestments } = profile;

  const savingsRate = monthlyIncome > 0
    ? Math.min(25, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 25)
    : 0;

  const debtRatio = monthlyIncome > 0
    ? Math.max(0, 25 - (totalDebts / (monthlyIncome * 12)) * 25)
    : 0;

  const emergencyScore = monthlyExpenses > 0
    ? Math.min(25, (emergencyFund / (monthlyExpenses * 6)) * 25)
    : 0;

  const investmentScore = monthlyIncome > 0
    ? Math.min(25, (totalInvestments / (monthlyIncome * 12)) * 25)
    : 0;

  const total = Math.round(savingsRate + debtRatio + emergencyScore + investmentScore);

  return {
    total: Math.min(100, Math.max(0, total)),
    savingsRate: Math.round(savingsRate),
    debtRatio: Math.round(debtRatio),
    emergencyScore: Math.round(emergencyScore),
    investmentScore: Math.round(investmentScore),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Needs Work";
  return "Critical";
}

export const EXPENSE_CATEGORIES = [
  { value: "FOOD", label: "Food & Dining", emoji: "🍕", color: "#f59e0b" },
  { value: "TRAVEL", label: "Travel", emoji: "✈️", color: "#3b82f6" },
  { value: "RENT", label: "Rent & Housing", emoji: "🏠", color: "#8b5cf6" },
  { value: "SHOPPING", label: "Shopping", emoji: "🛍️", color: "#ec4899" },
  { value: "BILLS", label: "Bills & Utilities", emoji: "💡", color: "#06b6d4" },
  { value: "EDUCATION", label: "Education", emoji: "📚", color: "#10b981" },
  { value: "HEALTH", label: "Health", emoji: "🏥", color: "#ef4444" },
  { value: "OTHER", label: "Other", emoji: "📦", color: "#6b7280" },
] as const;

export const INVESTMENT_TYPES = [
  { value: "STOCKS", label: "Stocks", color: "#3b82f6" },
  { value: "MUTUAL_FUNDS", label: "Mutual Funds", color: "#10b981" },
  { value: "ETFS", label: "ETFs", color: "#8b5cf6" },
  { value: "GOLD", label: "Gold", color: "#f59e0b" },
  { value: "CRYPTO", label: "Crypto", color: "#ec4899" },
] as const;

export const GOAL_TYPES = [
  { value: "HOUSE", label: "Buy House", emoji: "🏠" },
  { value: "CAR", label: "Buy Car", emoji: "🚗" },
  { value: "TRIP", label: "Foreign Trip", emoji: "✈️" },
  { value: "MARRIAGE", label: "Marriage", emoji: "💍" },
  { value: "EDUCATION", label: "Education", emoji: "🎓" },
  { value: "EMERGENCY", label: "Emergency Fund", emoji: "🛡️" },
  { value: "RETIREMENT", label: "Retirement", emoji: "🏖️" },
  { value: "CUSTOM", label: "Custom Goal", emoji: "🎯" },
] as const;

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getMonthlyContribution(target: number, current: number, deadlineStr: string): number {
  const diff = new Date(deadlineStr).getTime() - Date.now();
  if (diff <= 0) return 0;
  const months = diff / (1000 * 60 * 60 * 24 * 30.44);
  if (months <= 0) return 0;
  return Math.round((target - current) / months);
}

export const goalTypeIcons: Record<string, string> = {
  house: "🏠",
  car: "🚗",
  trip: "✈️",
  marriage: "💍",
  education: "🎓",
  emergency: "🛡️",
  retirement: "🏖️",
  custom: "🎯",
};

export function getDaysRemaining(deadlineStr: string): number {
  const diff = new Date(deadlineStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}
