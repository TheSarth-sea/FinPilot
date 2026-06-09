'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { calculateHomeAffordability, formatINR } from '@/lib/calculators';

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b'];

export default function HomeAffordabilityCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(120000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const result = useMemo(
    () =>
      calculateHomeAffordability(
        monthlyIncome,
        monthlyExpenses,
        downPayment,
        loanRate,
        loanTenure
      ),
    [monthlyIncome, monthlyExpenses, downPayment, loanRate, loanTenure]
  );

  const pieData = [
    { name: 'Down Payment', value: downPayment },
    { name: 'Loan Principal', value: Math.round(result.maxLoan) },
    { name: 'Total Interest', value: Math.round(result.totalCost - downPayment - result.maxLoan) },
  ];

  const netIncome = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Home Affordability{' '}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find out the maximum home price you can comfortably afford
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
            {/* Monthly Income */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Income
                </label>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {formatINR(monthlyIncome)}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={1000000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹20K</span>
                <span>₹10L</span>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Expenses
                </label>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {formatINR(monthlyExpenses)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-teal-500"
              />
            </div>

            {/* Down Payment */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Down Payment Available
                </label>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {formatINR(downPayment)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={100000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹2Cr</span>
              </div>
            </div>

            {/* Loan Interest Rate */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loan Interest Rate (p.a.)
                </label>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {loanRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={0.1}
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-teal-500"
              />
            </div>

            {/* Loan Tenure */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loan Tenure
                </label>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {loanTenure} Years
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-teal-500"
              />
            </div>

            {/* Rule notice */}
            <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-3">
              <p className="text-xs text-teal-700 dark:text-teal-300">
                💡 <strong>Rule:</strong> EMI should not exceed 40% of your net income
                ({formatINR(netIncome)}/mo). Max EMI = {formatINR(result.maxEMI)}/mo.
              </p>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                key={`home-${result.maxHomePrice}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="col-span-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-5 text-white shadow-lg"
              >
                <p className="text-sm font-medium opacity-80">Max Affordable Home Price</p>
                <p className="mt-1 text-3xl font-bold">{formatINR(result.maxHomePrice)}</p>
              </motion.div>
              <motion.div
                key={`emi-${result.maxEMI}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Monthly EMI</p>
                <p className="mt-1 text-xl font-bold">{formatINR(result.maxEMI)}</p>
              </motion.div>
              <motion.div
                key={`loan-${result.maxLoan}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Max Loan Amount
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatINR(result.maxLoan)}
                </p>
              </motion.div>
              <motion.div
                key={`interest-${result.totalCost}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Interest
                </p>
                <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(result.totalCost - downPayment - result.maxLoan)}
                </p>
              </motion.div>
              <motion.div
                key={`total-${result.totalCost}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Cost
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatINR(result.totalCost)}
                </p>
              </motion.div>
            </div>

            {/* Pie Chart */}
            <div className="flex-1 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Cost Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={{
                      backgroundColor: 'rgba(17,24,39,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
