"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import { calculateCarAffordability, calculateEMI } from "@/lib/calculators";
import { Car, IndianRupee, Shield, Fuel } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CarAffordabilityPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(45000);
  const [downPayment, setDownPayment] = useState(200000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenureYears, setTenureYears] = useState(5);

  const result = useMemo(() => calculateCarAffordability(monthlyIncome, monthlyExpenses, downPayment, interestRate, tenureYears), [monthlyIncome, monthlyExpenses, downPayment, interestRate, tenureYears]);

  const pieData = [
    { name: "Down Payment", value: downPayment, color: "#10b981" },
    { name: "Loan (EMI)", value: result.maxEMI * tenureYears * 12, color: "#3b82f6" },
    { name: "Insurance", value: result.insuranceEstimate * tenureYears, color: "#f59e0b" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2"><Car className="w-8 h-8 text-pink-500" /> Car Affordability Calculator</h1>
        <p className="text-muted-foreground">Find out how much car you can afford</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl space-y-5">
          {[
            { label: "Monthly Income", value: monthlyIncome, set: setMonthlyIncome, min: 20000, max: 500000, step: 5000, prefix: "₹" },
            { label: "Monthly Expenses", value: monthlyExpenses, set: setMonthlyExpenses, min: 10000, max: 300000, step: 5000, prefix: "₹" },
            { label: "Down Payment", value: downPayment, set: setDownPayment, min: 0, max: 2000000, step: 10000, prefix: "₹" },
            { label: "Interest Rate", value: interestRate, set: setInterestRate, min: 5, max: 20, step: 0.5, suffix: "%" },
            { label: "Loan Tenure", value: tenureYears, set: setTenureYears, min: 1, max: 7, step: 1, suffix: " yrs" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold">{s.prefix || ""}{s.value.toLocaleString("en-IN")}{s.suffix || ""}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-pink-500" />
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="glass-card p-6 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Maximum Car Price</p>
            <p className="text-3xl font-bold gradient-text">{formatINR(result.maxCarPrice)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 rounded-2xl"><p className="text-xs text-muted-foreground">Monthly EMI</p><p className="text-lg font-bold">{formatINR(result.maxEMI)}</p></div>
            <div className="glass-card p-4 rounded-2xl"><p className="text-xs text-muted-foreground">Max Loan</p><p className="text-lg font-bold">{formatINR(result.maxLoan)}</p></div>
            <div className="glass-card p-4 rounded-2xl"><p className="text-xs text-muted-foreground">Annual Insurance</p><p className="text-lg font-bold">{formatINR(result.insuranceEstimate)}</p></div>
            <div className="glass-card p-4 rounded-2xl"><p className="text-xs text-muted-foreground">Total Ownership</p><p className="text-lg font-bold">{formatINR(result.totalOwnershipCost)}</p></div>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-sm font-semibold mb-3">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                  {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-900/10 border border-pink-200/30 dark:border-pink-800/30">
            <p className="text-xs text-muted-foreground">💡 <strong>Rule of thumb:</strong> Car EMI should not exceed 15% of your net income. Your EMI limit: {formatINR(result.maxEMI)}/month.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
