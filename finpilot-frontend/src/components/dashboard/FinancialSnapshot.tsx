'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '@/store/financeStore';
import { formatINR } from '@/lib/utils';
import {
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];

const prevMonth = {
  income: 72000,
  expenses: 42000,
  savings: 480000,
  investments: 1150000,
};

export default function FinancialSnapshot() {
  const { monthlyIncome, monthlyExpenses, totalSavings, totalInvestments } =
    useFinanceStore();

  const cards = [
    {
      label: 'Income',
      value: monthlyIncome,
      prev: prevMonth.income,
      icon: <Wallet className="h-5 w-5" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Expenses',
      value: monthlyExpenses,
      prev: prevMonth.expenses,
      icon: <Receipt className="h-5 w-5" />,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-500/10',
    },
    {
      label: 'Savings',
      value: totalSavings,
      prev: prevMonth.savings,
      icon: <PiggyBank className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Investments',
      value: totalInvestments,
      prev: prevMonth.investments,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
    },
  ];

  const allocation = [
    { name: 'Income', value: monthlyIncome },
    { name: 'Expenses', value: monthlyExpenses },
    { name: 'Savings', value: totalSavings / 100 },
    { name: 'Investments', value: totalInvestments / 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Financial Snapshot
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map((card, i) => {
          const change = ((card.value - card.prev) / card.prev) * 100;
          const isUp = change >= 0;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className={`p-3 rounded-xl ${card.bg}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={card.color}>{card.icon}</span>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${
                  card.label === 'Expenses'
                    ? isUp ? 'text-red-500' : 'text-emerald-500'
                    : isUp ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {isUp ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {formatINR(card.value)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={4}
              dataKey="value"
            >
              {allocation.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => formatINR(Number(value))}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
