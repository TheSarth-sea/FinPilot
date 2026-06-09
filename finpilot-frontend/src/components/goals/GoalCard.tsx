'use client';

import { motion } from 'framer-motion';
import { formatINR, getDaysRemaining, getMonthlyContribution, getProgressPercentage } from '@/lib/utils';
import { Trash2, Edit3, Clock, TrendingUp } from 'lucide-react';
import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  index: number;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

export default function GoalCard({ goal, index, onEdit, onDelete }: GoalCardProps) {
  const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
  const daysLeft = getDaysRemaining(goal.deadline);
  const monthlyNeeded = getMonthlyContribution(goal.targetAmount, goal.currentAmount, goal.deadline);
  const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
  const expectedProgress = Math.min(100, ((Date.now() - new Date(goal.createdAt).getTime()) /
    (new Date(goal.deadline).getTime() - new Date(goal.createdAt).getTime())) * 100);
  const isOnTrack = progress >= expectedProgress * 0.85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h4>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
              isOnTrack
                ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10'
                : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-500/10'
            }`}>
              <TrendingUp className="h-3 w-3" />
              {isOnTrack ? 'On Track' : 'Behind'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Edit3 className="h-4 w-4 text-gray-400" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isOnTrack ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.1 * index, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="text-sm mb-4">
        <span className="font-bold text-gray-900 dark:text-white">{formatINR(goal.currentAmount)}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-500 dark:text-gray-400">{formatINR(goal.targetAmount)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-1 mb-0.5">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Days Left</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{daysLeft}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-1 mb-0.5">
            <TrendingUp className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Monthly</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatINR(monthlyNeeded)}
            <span className="text-xs text-gray-400 font-normal">/{monthsLeft}mo</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
