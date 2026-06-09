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
} from 'recharts';
import {
  calculateLumpsum,
  generateLumpsumGrowthData,
  formatINR,
} from '@/lib/calculators';

export default function LumpsumCalculatorPage() {
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const result = useMemo(
    () => calculateLumpsum(investmentAmount, expectedReturn, timePeriod),
    [investmentAmount, expectedReturn, timePeriod]
  );

  const growthData = useMemo(
    () => generateLumpsumGrowthData(investmentAmount, expectedReturn, timePeriod),
    [investmentAmount, expectedReturn, timePeriod]
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
            Lumpsum{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            See how your one-time investment grows with compound returns
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
            {/* Investment Amount */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Investment Amount
                </label>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {formatINR(investmentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Expected Return */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected Return Rate (p.a.)
                </label>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Period
                </label>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {timePeriod} {timePeriod === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                key={`inv-${result.investedAmount}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Invested Amount
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {formatINR(result.investedAmount)}
                </p>
              </motion.div>
              <motion.div
                key={`gain-${result.wealthGained}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Wealth Gained</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.wealthGained)}</p>
              </motion.div>
              <motion.div
                key={`final-${result.futureValue}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Final Value</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.futureValue)}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Investment Growth
            </h3>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="lumpsumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Future Value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#lumpsumGrad)"
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
