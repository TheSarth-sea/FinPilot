'use client';

import { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import { useFinanceStore } from '@/store/financeStore';
import { formatINR, getMonthlyContribution, goalTypeIcons } from '@/lib/utils';
import type { GoalType } from '@/types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const goalTemplates: { type: GoalType; label: string }[] = [
  { type: 'house', label: 'House' },
  { type: 'car', label: 'Car' },
  { type: 'trip', label: 'Trip' },
  { type: 'marriage', label: 'Marriage' },
  { type: 'education', label: 'Education' },
  { type: 'emergency', label: 'Emergency Fund' },
  { type: 'retirement', label: 'Retirement' },
  { type: 'custom', label: 'Custom' },
];

export default function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const [name, setName] = useState('');
  const [type, setType] = useState<GoalType>('house');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const monthlyContrib = useMemo(() => {
    const target = Number(targetAmount) || 0;
    const initial = Number(initialAmount) || 0;
    if (!deadline || target <= initial) return 0;
    return getMonthlyContribution(target, initial, deadline);
  }, [targetAmount, initialAmount, deadline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) return;

    addGoal({
      name,
      type,
      targetAmount: Number(targetAmount),
      currentAmount: Number(initialAmount) || 0,
      deadline,
      icon: goalTypeIcons[type] || '🎯',
    });

    setName('');
    setType('house');
    setTargetAmount('');
    setInitialAmount('');
    setDeadline('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dream Home Down Payment"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {goalTemplates.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setType(t.type)}
                className={`p-2 rounded-xl border text-center transition-all text-sm ${
                  type === t.type
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-lg block mb-0.5">{goalTypeIcons[t.type]}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Amount (₹)
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="25,00,000"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Amount (₹)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Date
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {monthlyContrib > 0 && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly contribution needed
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(monthlyContrib)}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Add Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}
