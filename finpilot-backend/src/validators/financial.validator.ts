import { z } from "zod";

// --- Expense Validators ---
export const createExpenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999, "Amount too large"),
  category: z.enum([
    "FOOD",
    "TRAVEL",
    "RENT",
    "SHOPPING",
    "BILLS",
    "EDUCATION",
    "HEALTH",
    "OTHER",
  ]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be at most 500 characters")
    .trim(),
  date: z.string().datetime({ message: "Invalid date format" }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")),
  receiptUrl: z.string().url("Invalid URL").optional().nullable(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseQuerySchema = z.object({
  category: z
    .enum([
      "FOOD",
      "TRAVEL",
      "RENT",
      "SHOPPING",
      "BILLS",
      "EDUCATION",
      "HEALTH",
      "OTHER",
    ])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
});

// --- Goal Validators ---
export const createGoalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(200, "Name must be at most 200 characters")
    .trim(),
  type: z.enum([
    "HOUSE",
    "CAR",
    "TRIP",
    "MARRIAGE",
    "EDUCATION",
    "EMERGENCY",
    "RETIREMENT",
    "CUSTOM",
  ]),
  targetAmount: z
    .number()
    .positive("Target amount must be positive")
    .max(9999999999, "Amount too large"),
  currentAmount: z.number().min(0, "Current amount cannot be negative").default(0),
  deadline: z.string().min(1, "Deadline is required"),
  monthlyContribution: z
    .number()
    .min(0, "Monthly contribution cannot be negative")
    .default(0),
});

export const updateGoalSchema = createGoalSchema.partial();

// --- Investment Validators ---
export const createInvestmentSchema = z.object({
  type: z.enum(["STOCKS", "MUTUAL_FUNDS", "ETFS", "GOLD", "CRYPTO"]),
  name: z
    .string()
    .min(1, "Investment name is required")
    .max(200, "Name must be at most 200 characters")
    .trim(),
  amountInvested: z
    .number()
    .positive("Amount invested must be positive")
    .max(9999999999, "Amount too large"),
  currentValue: z
    .number()
    .min(0, "Current value cannot be negative")
    .max(9999999999, "Amount too large"),
  units: z.number().min(0, "Units cannot be negative").default(0),
  purchaseDate: z.string().min(1, "Purchase date is required"),
});

export const updateInvestmentSchema = createInvestmentSchema.partial();

// --- Budget Validators ---
export const createBudgetSchema = z.object({
  month: z.string().min(1, "Month is required"),
  income: z
    .number()
    .positive("Income must be positive")
    .max(9999999999, "Amount too large"),
  needsLimit: z.number().min(0, "Needs limit cannot be negative"),
  wantsLimit: z.number().min(0, "Wants limit cannot be negative"),
  savingsLimit: z.number().min(0, "Savings limit cannot be negative"),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// --- Financial Profile Validators ---
export const updateProfileSchema = z.object({
  monthlyIncome: z.number().min(0, "Income cannot be negative").optional(),
  monthlyExpenses: z.number().min(0, "Expenses cannot be negative").optional(),
  totalSavings: z.number().min(0, "Savings cannot be negative").optional(),
  totalInvestments: z
    .number()
    .min(0, "Investments cannot be negative")
    .optional(),
  totalDebts: z.number().min(0, "Debts cannot be negative").optional(),
  emergencyFund: z
    .number()
    .min(0, "Emergency fund cannot be negative")
    .optional(),
});

// --- Chat Validators ---
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be at most 2000 characters")
    .trim(),
});

// --- ID Param Validator ---
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});
