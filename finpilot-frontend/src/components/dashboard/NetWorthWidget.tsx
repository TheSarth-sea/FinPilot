'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '@/store/financeStore';
import { formatINR } from '@/lib/utils';
import { TrendingUp, Wallet, CreditCard } from 'lucide-react';

const netWorthData = [
  { month: 'Jul', assets: 1150000, liabilities: 380000, netWorth: 770000 },
  { month: 'Aug', assets: 1210000, liabilities: 370000, netWorth: 840000 },
  { month: 'Sep', assets: 1280000, liabilities: 360000, netWorth: 920000 },
  { month: 'Oct', assets: 1320000, liabilities: 350000, netWorth: 970000 },
  { month: 'Nov', assets: 1380000, liabilities: 345000, netWorth: 1035000 },
  { month: 'Dec', assets: 1420000, liabilities: 340000, netWorth: 1080000 },
  { month: 'Jan', assets: 1480000, liabilities: 330000, netWorth: 1150000 },
  { month: 'Feb', assets: 1530000, liabilities: 325000, netWorth: 1205000 },
  { month: 'Mar', assets: 1580000, liabilities: 320000, netWorth: 1260000 },
  { month: 'Apr', assets: 1620000, liabilities: 315000, netWorth: 1305000 },
  { month: 'May', assets: 1660000, liabilities: 305000, netWorth: 1355000 },
  { month: 'Jun', assets: 1700000, liabilities: 300000, netWorth: 1400000 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-xl">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatINR(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function NetWorthWidget() {
  const { totalSavings, totalInvestments, totalDebts } = useFinanceStore();
  const assets = totalSavings + totalInvestments;
  const netWorth = assets - totalDebts;
  const isPositive = netWorth >= 0;
  const monthlyChange = netWorth - netWorthData[netWorthData.length - 2].netWorth;
  const changePercent = ((monthlyChange / netWorthData[netWorthData.length - 2].netWorth) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Net Worth
          </h3>
        </div>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
          isPositive
            ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
            : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
        }`}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}% this month
        </span>
      </div>

      <p className={`text-3xl font-bold mb-4 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {formatINR(netWorth)}
      </p>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={netWorthData}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="netWorth"
              name="Net Worth"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#netWorthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
          <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Assets</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatINR(assets)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
          <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Liabilities</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatINR(totalDebts)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
