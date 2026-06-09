'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  calculateCompoundInterest,
  generateCompoundGrowthData,
  formatINR,
  type CompoundingFrequency,
} from '@/lib/calculators';

const frequencies: { value: CompoundingFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half-yearly', label: 'Half-Yearly' },
  { value: 'yearly', label: 'Yearly' },
];

const CHART_COLORS = {
  monthly: '#10b981',
  quarterly: '#6366f1',
  halfYearly: '#f59e0b',
  yearly: '#ef4444',
};

export default function CompoundInterestCalculatorPage() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState<CompoundingFrequency>('monthly');

  const result = useMemo(
    () => calculateCompoundInterest(principal, rate, years, frequency),
    [principal, rate, years, frequency]
  );

  const growthData = useMemo(
    () => generateCompoundGrowthData(principal, rate, years),
    [principal, rate, years]
  );

  // Comparison table across all frequencies
  const comparisonData = useMemo(
    () =>
      frequencies.map((f) => {
        const res = calculateCompoundInterest(principal, rate, years, f.value);
        return {
          label: f.label,
          finalAmount: Math.round(res.finalAmount),
          totalInterest: Math.round(res.totalInterest),
        };
      }),
    [principal, rate, years]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Compound Interest{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            See the power of compounding with different frequencies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80 sm:p-8"
          >
            {/* Principal */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Principal Amount
                </label>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Rate */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {rate}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Period
                </label>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {years} {years === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Frequency Selector */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {frequencies.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      frequency === f.value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                key={`p-${result.principal}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Principal</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {formatINR(result.principal)}
                </p>
              </motion.div>
              <motion.div
                key={`i-${result.totalInterest}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Total Interest</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.totalInterest)}</p>
              </motion.div>
              <motion.div
                key={`f-${result.finalAmount}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Final Amount</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.finalAmount)}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Charts & Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Growth Chart */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Growth: All Frequencies Compared
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="ciMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="year"
                    tickFormatter={(v) => `Yr ${v}`}
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 10000000
                        ? `${(v / 10000000).toFixed(1)}Cr`
                        : v >= 100000
                        ? `${(v / 100000).toFixed(1)}L`
                        : `${(v / 1000).toFixed(0)}K`
                    }
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(17,24,39,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="monthly"
                    name="Monthly"
                    stroke={CHART_COLORS.monthly}
                    strokeWidth={2}
                    fill="url(#ciMonthly)"
                  />
                  <Area
                    type="monotone"
                    dataKey="quarterly"
                    name="Quarterly"
                    stroke={CHART_COLORS.quarterly}
                    strokeWidth={2}
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="halfYearly"
                    name="Half-Yearly"
                    stroke={CHART_COLORS.halfYearly}
                    strokeWidth={2}
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="yearly"
                    name="Yearly"
                    stroke={CHART_COLORS.yearly}
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Table */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Frequency Comparison
              </h3>
              <div className="overflow-hidden rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        Frequency
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        Final Amount
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        Total Interest
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr
                        key={row.label}
                        className={`border-t border-gray-100 dark:border-gray-800 ${
                          frequencies[i].value === frequency
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                          {formatINR(row.finalAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                          {formatINR(row.totalInterest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
