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
  ReferenceLine,
} from 'recharts';
import { calculateRetirement, formatINR } from '@/lib/calculators';

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(40000);
  const [inflationRate, setInflationRate] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySIP, setMonthlySIP] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const result = useMemo(
    () =>
      calculateRetirement(
        currentAge,
        retirementAge,
        currentMonthlyExpenses,
        inflationRate,
        currentSavings,
        monthlySIP,
        expectedReturn
      ),
    [currentAge, retirementAge, currentMonthlyExpenses, inflationRate, currentSavings, monthlySIP, expectedReturn]
  );

  const chartData = [
    {
      name: 'Required Corpus',
      amount: Math.round(result.requiredCorpus),
      fill: '#ef4444',
    },
    {
      name: 'Current Savings (FV)',
      amount: Math.round(result.futureValueOfCurrentSavings),
      fill: '#10b981',
    },
    {
      name: 'SIP Accumulation',
      amount: Math.round(result.futureValueOfSIP),
      fill: '#6366f1',
    },
    {
      name: 'Total Accumulated',
      amount: Math.round(result.totalAccumulated),
      fill: '#f59e0b',
    },
  ];

  const sliderClass =
    'w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-rose-500';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Retirement{' '}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Plan your retirement corpus and find if you&apos;re on track
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
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Current Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Current Age
                  </label>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {currentAge}
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={55}
                  value={currentAge}
                  onChange={(e) => {
                    const age = Number(e.target.value);
                    setCurrentAge(age);
                    if (age >= retirementAge) setRetirementAge(age + 5);
                  }}
                  className={sliderClass}
                />
              </div>

              {/* Retirement Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Retirement Age
                  </label>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {retirementAge}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentAge + 1}
                  max={75}
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className={sliderClass}
                />
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Monthly Expenses
                </label>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {formatINR(currentMonthlyExpenses)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={currentMonthlyExpenses}
                onChange={(e) => setCurrentMonthlyExpenses(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Inflation Rate */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected Inflation Rate
                </label>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {inflationRate}%
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Current Savings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Savings
                </label>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {formatINR(currentSavings)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50000000}
                step={100000}
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Monthly SIP */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly SIP
                </label>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {formatINR(monthlySIP)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(Number(e.target.value))}
                className={sliderClass}
              />
            </div>

            {/* Expected Return */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected Return (p.a.)
                </label>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className={sliderClass}
              />
            </div>
          </motion.div>

          {/* Results & Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                key={`corpus-${result.requiredCorpus}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Required Corpus</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.requiredCorpus)}</p>
              </motion.div>
              <motion.div
                key={`accumulated-${result.totalAccumulated}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Projected Savings</p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.totalAccumulated)}</p>
              </motion.div>
              <motion.div
                key={`gap-${result.gap}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`rounded-xl p-4 text-white shadow-lg ${
                  result.gap > 0
                    ? 'bg-gradient-to-br from-red-500 to-orange-500'
                    : 'bg-gradient-to-br from-emerald-500 to-green-500'
                }`}
              >
                <p className="text-xs font-medium opacity-80">
                  {result.gap > 0 ? 'Shortfall' : 'Surplus'}
                </p>
                <p className="mt-1 text-lg font-bold">{formatINR(result.gap > 0 ? result.gap : result.totalAccumulated - result.requiredCorpus)}</p>
              </motion.div>
              <motion.div
                key={`additional-${result.additionalMonthlySavingNeeded}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Extra Monthly SIP Needed</p>
                <p className="mt-1 text-lg font-bold">
                  {result.gap > 0 ? formatINR(result.additionalMonthlySavingNeeded) : '₹0'}
                </p>
              </motion.div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Years to Retirement
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {result.yearsToRetirement}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Monthly Expense at Retirement
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {formatINR(result.monthlyExpensesAtRetirement)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Corpus Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      v >= 10000000
                        ? `${(v / 10000000).toFixed(1)}Cr`
                        : v >= 100000
                        ? `${(v / 100000).toFixed(0)}L`
                        : `${(v / 1000).toFixed(0)}K`
                    }
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    stroke="#9ca3af"
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={{
                      backgroundColor: 'rgba(17,24,39,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                      <motion.rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                  <ReferenceLine
                    x={Math.round(result.requiredCorpus)}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: 'Required', fill: '#ef4444', fontSize: 11 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
