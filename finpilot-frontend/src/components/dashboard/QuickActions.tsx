'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Target, Calculator, ClipboardList } from 'lucide-react';

const actions = [
  {
    label: 'Add Expense',
    icon: <Plus className="h-6 w-6" />,
    href: '/expenses',
    gradient: 'from-emerald-500 to-cyan-500',
    bgHover: 'group-hover:bg-emerald-500/10',
  },
  {
    label: 'Set Goal',
    icon: <Target className="h-6 w-6" />,
    href: '/goals',
    gradient: 'from-violet-500 to-purple-500',
    bgHover: 'group-hover:bg-violet-500/10',
  },
  {
    label: 'SIP Calculator',
    icon: <Calculator className="h-6 w-6" />,
    href: '/calculators',
    gradient: 'from-orange-500 to-red-500',
    bgHover: 'group-hover:bg-orange-500/10',
  },
  {
    label: 'Budget Planner',
    icon: <ClipboardList className="h-6 w-6" />,
    href: '/budget',
    gradient: 'from-blue-500 to-indigo-500',
    bgHover: 'group-hover:bg-blue-500/10',
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <Link href={action.href} key={action.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-transparent transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${action.bgHover} transition-colors`}>
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {action.icon}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {action.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
