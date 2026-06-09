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
import {
  calculateEMI,
  generateAmortizationSchedule,
  formatINR,
} from '@/lib/calculators';

const COLORS = ['#10b981', '#6366f1'];

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [showSchedule, setShowSchedule] = useState(false);

  const tenureMonths = tenure * 12;

  const result = useMemo(
    () => calculateEMI(principal, rate, tenureMonths),
    [principal, rate, tenureMonths]
  );

  const schedule = useMemo(
    () => generateAmortizationSchedule(principal, rate, tenure),
    [principal, rate, tenure]
  );

  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: Math.round(result.totalInterest) },
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
            EMI{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Calculate your Equated Monthly Installment for any loan
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
            {/* Loan Amount */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loan Amount
                </label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>₹1L</span>
                <span>₹5Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {rate}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loan Tenure
                </label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {tenure} {tenure === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                key={result.emi}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Monthly EMI</p>
                <p className="mt-1 text-xl font-bold">{formatINR(result.emi)}</p>
              </motion.div>
              <motion.div
                key={result.totalInterest}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-medium opacity-80">Total Interest</p>
                <p className="mt-1 text-xl font-bold">{formatINR(result.totalInterest)}</p>
              </motion.div>
              <motion.div
                key={result.totalPayment}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Payment</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatINR(result.totalPayment)}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Payment Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
          </motion.div>
        </div>

        {/* Amortization Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
          </button>

          {showSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80"
            >
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        Month
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        EMI
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        Principal
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        Interest
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr
                        key={row.month}
                        className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {row.month}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {formatINR(row.emi)}
                        </td>
                        <td className="px-4 py-2 text-right text-emerald-600 dark:text-emerald-400">
                          {formatINR(row.principal)}
                        </td>
                        <td className="px-4 py-2 text-right text-violet-600 dark:text-violet-400">
                          {formatINR(row.interest)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                          {formatINR(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
