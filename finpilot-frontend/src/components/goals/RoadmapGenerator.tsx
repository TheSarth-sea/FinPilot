'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '@/lib/utils';
import { MapPin, Target, Sparkles, TrendingUp, Shield, PiggyBank } from 'lucide-react';
import type { RoadmapMilestone } from '@/types';

export default function RoadmapGenerator() {
  const [currentAge, setCurrentAge] = useState(28);
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [primaryGoal, setPrimaryGoal] = useState<string>('retirement');
  const [generated, setGenerated] = useState(false);

  const milestones = useMemo<RoadmapMilestone[]>(() => {
    if (!generated) return [];

    const emergencyTarget = monthlyIncome * 6;
    const sipMonthly = Math.round(monthlyIncome * 0.2);
    const retirementCorpus = monthlyIncome * 12 * 25;

    const items: RoadmapMilestone[] = [
      {
        age: currentAge,
        title: 'Start Emergency Fund',
        description: `Build a safety net of ${formatINR(emergencyTarget)} (6 months expenses).`,
        target: emergencyTarget,
        completed: true,
      },
      {
        age: currentAge + 1,
        title: 'Begin SIP Investments',
        description: `Start a monthly SIP of ${formatINR(sipMonthly)} in diversified equity funds.`,
        target: sipMonthly * 12,
        completed: false,
      },
      {
        age: currentAge + 2,
        title: 'Health & Term Insurance',
        description: 'Get a ₹1 Cr term insurance and ₹10 L health cover for family.',
        target: 25000,
        completed: false,
      },
      {
        age: currentAge + 5,
        title: 'Mid-Term Goal Progress',
        description: `Accumulate ${formatINR(sipMonthly * 12 * 5)} through disciplined SIPs and bonuses.`,
        target: sipMonthly * 12 * 5,
        completed: false,
      },
    ];

    if (primaryGoal === 'house') {
      items.push({
        age: currentAge + 8,
        title: 'Home Down Payment Ready',
        description: `Save ${formatINR(monthlyIncome * 12 * 4)} for a 20% down payment on your dream home.`,
        target: monthlyIncome * 12 * 4,
        completed: false,
      });
    }

    if (primaryGoal === 'retirement') {
      items.push({
        age: 45,
        title: 'Half-way to Retirement Corpus',
        description: `Reach ${formatINR(retirementCorpus / 2)} through compounding and consistent investing.`,
        target: retirementCorpus / 2,
        completed: false,
      });
      items.push({
        age: 55,
        title: 'Retirement Ready',
        description: `Target corpus of ${formatINR(retirementCorpus)} achieved through power of compounding.`,
        target: retirementCorpus,
        completed: false,
      });
    }

    if (primaryGoal === 'education') {
      items.push({
        age: currentAge + 10,
        title: 'Education Fund Ready',
        description: `Accumulate ${formatINR(2000000)} for higher education through a mix of equity and debt funds.`,
        target: 2000000,
        completed: false,
      });
    }

    return items.sort((a, b) => a.age - b.age);
  }, [generated, currentAge, monthlyIncome, primaryGoal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-violet-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Roadmap Generator
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            min={18}
            max={60}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            min={10000}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Primary Goal
          </label>
          <select
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
          >
            <option value="retirement">Retirement</option>
            <option value="house">Buy a House</option>
            <option value="education">Higher Education</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setGenerated(true)}
        className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all mb-6 flex items-center justify-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Generate My Roadmap
      </button>

      {generated && milestones.length > 0 && (
        <div className="space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/5 dark:to-purple-500/5 border border-violet-200 dark:border-violet-500/20">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Saving Target</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatINR(Math.round(monthlyIncome * 0.3))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">SIP Recommendation</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatINR(Math.round(monthlyIncome * 0.2))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Fund Target</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatINR(monthlyIncome * 6)}</p>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-500 to-purple-500" />
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="relative mb-6 last:mb-0"
              >
                <div className={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 ${
                  milestone.completed
                    ? 'bg-violet-500 border-violet-500'
                    : 'bg-white dark:bg-gray-900 border-violet-400'
                }`} />
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                      Age {milestone.age}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Target: {formatINR(milestone.target || 0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
