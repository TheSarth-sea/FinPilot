'use client';

import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/financeStore';
import { formatINR, formatDate, EXPENSE_CATEGORIES } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTransactions() {
  const { expenses } = useFinanceStore();

  const sorted = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <a
          href="/expenses"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View All
        </a>
      </div>

      <div className="space-y-1">
        {sorted.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              {EXPENSE_CATEGORIES.find((c) => c.value === tx.category)?.emoji || '📌'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {tx.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(tx.date)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {tx.type === 'income' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  tx.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
