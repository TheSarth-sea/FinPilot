'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/financeStore';
import { calculateHealthScore } from '@/lib/utils';
import { Shield } from 'lucide-react';

export default function FinancialHealthScore() {
  const { monthlyIncome, monthlyExpenses, totalSavings, totalInvestments, totalDebts, emergencyFund } = useFinanceStore();
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = calculateHealthScore({
    monthlyIncome,
    monthlyExpenses,
    totalInvestments,
    totalDebts,
    emergencyFund,
  });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedScore(Math.round(progress * score.total));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score.total]);

  const getColor = (s: number) => {
    if (s < 40) return { stroke: '#ef4444', text: 'text-red-500', label: 'Needs Improvement' };
    if (s <= 70) return { stroke: '#eab308', text: 'text-yellow-500', label: 'Good' };
    return { stroke: '#22c55e', text: 'text-emerald-500', label: 'Excellent' };
  };

  const color = getColor(score.total);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const breakdowns = [
    { label: 'Savings Rate', value: score.savingsRate, max: 25, color: 'bg-emerald-500' },
    { label: 'Debt Ratio', value: score.debtRatio, max: 25, color: 'bg-blue-500' },
    { label: 'Emergency Fund', value: score.emergencyScore, max: 25, color: 'bg-violet-500' },
    { label: 'Investment Score', value: score.investmentScore, max: 25, color: 'bg-cyan-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Health Score
        </h3>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              stroke={color.stroke}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color.text}`}>
              {animatedScore}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              out of 100
            </span>
          </div>
        </div>
        <span className={`text-sm font-medium mt-2 ${color.text}`}>
          {color.label}
        </span>
      </div>

      <div className="space-y-3">
        {breakdowns.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.value}/{item.max}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / item.max) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
