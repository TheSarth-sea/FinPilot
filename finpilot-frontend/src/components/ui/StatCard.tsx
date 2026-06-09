'use client';

import { motion } from 'framer-motion';
import { cn, formatINR } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  changePercent: number;
  className?: string;
  iconBg?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  changePercent,
  className,
  iconBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}: StatCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
        'border border-white/20 dark:border-white/10',
        'shadow-lg dark:shadow-none p-6 cursor-default',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl', iconBg)}>
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full',
            isPositive
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span>{Math.abs(changePercent).toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatINR(value)}
      </p>
    </motion.div>
  );
}
