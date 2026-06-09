'use client';

import { create } from 'zustand';
import type { Expense, Goal, Investment, Notification } from '@/types';
import { generateId } from '@/lib/utils';

interface FinanceState {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  emergencyFund: number;
  expenses: Expense[];
  goals: Goal[];
  investments: Investment[];
  notifications: Notification[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  removeInvestment: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setMonthlyIncome: (income: number) => void;
}

const demoExpenses: Expense[] = [
  { id: 'exp_001', amount: 18000, category: 'rent', description: 'Monthly Rent - Koramangala', date: '2026-06-01T00:00:00Z', type: 'expense' },
  { id: 'exp_002', amount: 75000, category: 'salary', description: 'Salary Credit - June', date: '2026-06-01T08:00:00Z', type: 'income' },
  { id: 'exp_003', amount: 2450, category: 'food', description: 'Swiggy - Weekly Groceries', date: '2026-06-02T11:30:00Z', type: 'expense' },
  { id: 'exp_004', amount: 999, category: 'entertainment', description: 'Netflix Subscription', date: '2026-06-02T00:00:00Z', type: 'expense' },
  { id: 'exp_005', amount: 3200, category: 'bills', description: 'Electricity Bill - BESCOM', date: '2026-06-03T09:00:00Z', type: 'expense' },
  { id: 'exp_006', amount: 1500, category: 'travel', description: 'Uber Rides - Week 1', date: '2026-06-03T18:00:00Z', type: 'expense' },
  { id: 'exp_007', amount: 5600, category: 'shopping', description: 'Myntra - Work Clothes', date: '2026-06-04T14:00:00Z', type: 'expense' },
  { id: 'exp_008', amount: 850, category: 'food', description: 'Lunch with Colleagues', date: '2026-06-04T13:00:00Z', type: 'expense' },
  { id: 'exp_009', amount: 15000, category: 'investment', description: 'SIP - Axis Bluechip Fund', date: '2026-06-05T10:00:00Z', type: 'expense' },
  { id: 'exp_010', amount: 2200, category: 'health', description: 'Apollo Pharmacy - Medicines', date: '2026-06-05T16:00:00Z', type: 'expense' },
  { id: 'exp_011', amount: 1200, category: 'food', description: 'Zepto - Groceries', date: '2026-06-06T10:00:00Z', type: 'expense' },
  { id: 'exp_012', amount: 4500, category: 'education', description: 'Udemy Course - React Mastery', date: '2026-06-06T20:00:00Z', type: 'expense' },
  { id: 'exp_013', amount: 700, category: 'food', description: 'Coffee & Snacks - Starbucks', date: '2026-06-07T09:00:00Z', type: 'expense' },
  { id: 'exp_014', amount: 12000, category: 'freelance', description: 'Freelance Project Payment', date: '2026-06-04T12:00:00Z', type: 'income' },
  { id: 'exp_015', amount: 3500, category: 'bills', description: 'Internet + Mobile Bill', date: '2026-06-05T00:00:00Z', type: 'expense' },
];

const demoGoals: Goal[] = [
  {
    id: 'goal_001',
    name: 'Dream Home Down Payment',
    type: 'house',
    targetAmount: 2500000,
    currentAmount: 850000,
    deadline: '2028-12-31',
    createdAt: '2025-06-01T00:00:00Z',
    icon: '🏠',
  },
  {
    id: 'goal_002',
    name: 'Europe Trip',
    type: 'trip',
    targetAmount: 400000,
    currentAmount: 175000,
    deadline: '2027-03-15',
    createdAt: '2025-09-01T00:00:00Z',
    icon: '✈️',
  },
  {
    id: 'goal_003',
    name: 'Emergency Fund',
    type: 'emergency',
    targetAmount: 300000,
    currentAmount: 200000,
    deadline: '2026-12-31',
    createdAt: '2025-01-15T00:00:00Z',
    icon: '🛡️',
  },
  {
    id: 'goal_004',
    name: 'New Car - Tata Nexon',
    type: 'car',
    targetAmount: 1200000,
    currentAmount: 320000,
    deadline: '2028-06-30',
    createdAt: '2025-12-01T00:00:00Z',
    icon: '🚗',
  },
  {
    id: 'goal_005',
    name: 'MBA Fund',
    type: 'education',
    targetAmount: 2000000,
    currentAmount: 450000,
    deadline: '2029-07-01',
    createdAt: '2025-03-10T00:00:00Z',
    icon: '🎓',
  },
];

const demoInvestments: Investment[] = [
  { id: 'inv_001', name: 'Axis Bluechip Fund', type: 'mutual_funds', amountInvested: 300000, currentValue: 368000, units: 7521.34, purchaseDate: '2024-06-15' },
  { id: 'inv_002', name: 'HDFC Nifty 50 ETF', type: 'etf', amountInvested: 150000, currentValue: 178500, units: 850, purchaseDate: '2024-09-01' },
  { id: 'inv_003', name: 'Infosys Ltd', type: 'stocks', amountInvested: 180000, currentValue: 215000, units: 120, purchaseDate: '2024-03-20' },
  { id: 'inv_004', name: 'Reliance Industries', type: 'stocks', amountInvested: 200000, currentValue: 242000, units: 80, purchaseDate: '2024-01-10' },
  { id: 'inv_005', name: 'Sovereign Gold Bond', type: 'gold', amountInvested: 100000, currentValue: 128000, units: 15.6, purchaseDate: '2024-11-01' },
  { id: 'inv_006', name: 'Bitcoin', type: 'crypto', amountInvested: 50000, currentValue: 42000, units: 0.0045, purchaseDate: '2025-01-15' },
  { id: 'inv_007', name: 'PPF Account', type: 'ppf', amountInvested: 150000, currentValue: 162000, units: 1, purchaseDate: '2023-04-01' },
  { id: 'inv_008', name: 'SBI FD - 1 Year', type: 'fd', amountInvested: 100000, currentValue: 107200, units: 1, purchaseDate: '2025-06-01' },
];

const demoNotifications: Notification[] = [
  { id: 'notif_001', title: 'SIP Due Tomorrow', message: 'Your SIP of ₹15,000 for Axis Bluechip Fund is due tomorrow.', type: 'sip', read: false, createdAt: '2026-06-07T08:00:00Z' },
  { id: 'notif_002', title: 'Goal Milestone Reached!', message: 'Congratulations! Your Emergency Fund has reached 67% of the target.', type: 'goal', read: false, createdAt: '2026-06-06T14:00:00Z' },
  { id: 'notif_003', title: 'Electricity Bill Due', message: 'Your BESCOM electricity bill of ₹3,200 is due in 3 days.', type: 'bill', read: false, createdAt: '2026-06-06T09:00:00Z' },
  { id: 'notif_004', title: 'Budget Alert', message: 'You have spent 85% of your Food budget this month.', type: 'alert', read: true, createdAt: '2026-06-05T17:00:00Z' },
  { id: 'notif_005', title: 'Investment Returns Update', message: 'Your Infosys stock has gained 19.4% since purchase. Consider reviewing your portfolio.', type: 'info', read: true, createdAt: '2026-06-04T10:00:00Z' },
  { id: 'notif_006', title: 'Credit Card Bill Reminder', message: 'Your credit card bill of ₹12,500 is due on June 15.', type: 'bill', read: true, createdAt: '2026-06-03T08:00:00Z' },
];

export const useFinanceStore = create<FinanceState>((set) => ({
  monthlyIncome: 75000,
  monthlyExpenses: 45000,
  totalSavings: 500000,
  totalInvestments: 1200000,
  totalDebts: 300000,
  emergencyFund: 200000,
  expenses: demoExpenses,
  goals: demoGoals,
  investments: demoInvestments,
  notifications: demoNotifications,

  addExpense: (expense) =>
    set((state) => ({
      expenses: [{ ...expense, id: generateId() }, ...state.expenses],
    })),

  removeExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        { ...goal, id: generateId(), createdAt: new Date().toISOString() },
      ],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),

  addInvestment: (investment) =>
    set((state) => ({
      investments: [
        ...state.investments,
        { ...investment, id: generateId() },
      ],
    })),

  updateInvestment: (id, updates) =>
    set((state) => ({
      investments: state.investments.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),

  removeInvestment: (id) =>
    set((state) => ({
      investments: state.investments.filter((i) => i.id !== id),
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  setMonthlyIncome: (income) =>
    set({ monthlyIncome: income }),
}));
