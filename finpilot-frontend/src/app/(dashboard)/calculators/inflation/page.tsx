'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  calculateInflation,
  generateInflationData,
  formatINR,
} from '@/lib/calculators';

export default function InflationCalculatorPage() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const result = useMemo(
    () => calculateInflation(currentAmount, inflationRate, years),
    [currentAmount, inflationRate, years]
  );

  const inflationData = useMemo(
    () => generateInflationData(currentAmount, inflationRate, years),
    [currentAmount, inflationRate, years]
  );

  const comparisonData = [
    { label: 'Today', value: currentAmount, fill: '#10b981' },
    {
      label: `After ${years} Yrs`,
      value: Math.round(result.purchasingPower),
      fill: '#ef4444',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Inflation{' '}
            <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Understand how inflation erodes the value of your money over time
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
            {/* Current Amount */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Amount
                </label>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {formatINR(currentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inflation Rate (p.a.)
                </label>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {inflationRate}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Years */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Years
                </label>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
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
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                key={`future-${result.futureEquivalent}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-red-500 to-rose-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Future Cost</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.futureEquivalent)}</p>
                <p className="text-xs opacity-70 mt-1">
                  What {formatINR(currentAmount)} will cost then
                </p>
              </motion.div>
              <motion.div
                key={`effective-${result.purchasingPower}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Real Value</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.purchasingPower)}</p>
                <p className="text-xs opacity-70 mt-1">
                  Purchasing power of {formatINR(currentAmount)}
                </p>
              </motion.div>
              <motion.div
                key={`lost-${result.lossPercent}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Value Lost
                </p>
                <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">
                  {formatINR(currentAmount - result.purchasingPower)}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Bar Comparison */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Purchasing Power: Today vs Future
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      v >= 100000
                        ? `${(v / 100000).toFixed(1)}L`
                        : `${(v / 1000).toFixed(0)}K`
                    }
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis dataKey="label" type="category" width={100} stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={{
                      backgroundColor: 'rgba(17,24,39,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {comparisonData.map((entry, index) => (
                      <motion.rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart - Decline over time */}
            <div className="flex-1 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Value Erosion Over Time
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={inflationData}>
                  <defs>
                    <linearGradient id="inflationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                      v >= 100000
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
                    dataKey="futureEquivalent"
                    name="Cost to Buy Same Things"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#inflationGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="futureEquivalent"
                    name="Real Value (After Inflation)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#inflationGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
