"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore } from "@/store";
import { formatINR } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from "recharts";
import { Plus, X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  stocks: "#3b82f6", mutual_funds: "#10b981", etf: "#8b5cf6", gold: "#f59e0b", crypto: "#ec4899", ppf: "#06b6d4", fd: "#f97316",
  STOCKS: "#3b82f6", MUTUAL_FUNDS: "#10b981", ETFS: "#8b5cf6", GOLD: "#f59e0b", CRYPTO: "#ec4899",
};

const TYPE_LABELS: Record<string, string> = {
  stocks: "Stocks", mutual_funds: "Mutual Funds", etf: "ETFs", gold: "Gold", crypto: "Crypto", ppf: "PPF", fd: "Fixed Deposit",
  STOCKS: "Stocks", MUTUAL_FUNDS: "Mutual Funds", ETFS: "ETFs", GOLD: "Gold", CRYPTO: "Crypto",
};

export default function InvestmentsPage() {
  const { investments, addInvestment, removeInvestment } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [newInv, setNewInv] = useState({ name: "", type: "mutual_funds", amountInvested: 0, currentValue: 0, units: 0, purchaseDate: "" });

  const totalInvested = investments.reduce((s, i) => s + i.amountInvested, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPct = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(1) : "0";

  // Allocation pie
  const allocation = useMemo(() => {
    const map: Record<string, number> = {};
    investments.forEach((i) => { map[i.type] = (map[i.type] || 0) + i.currentValue; });
    return Object.entries(map).map(([type, value]) => ({ name: TYPE_LABELS[type] || type, value, color: TYPE_COLORS[type] || "#6b7280" }));
  }, [investments]);

  // Mock growth data
  const growthData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i).toLocaleString("en", { month: "short" }),
    value: totalCurrent - (12 - i) * (totalReturn / 12) + Math.random() * 20000,
  }));

  const handleAdd = () => {
    if (!newInv.name || !newInv.amountInvested) return;
    addInvestment({ ...newInv, purchaseDate: newInv.purchaseDate || new Date().toISOString() });
    setShowModal(false);
    setNewInv({ name: "", type: "mutual_funds", amountInvested: 0, currentValue: 0, units: 0, purchaseDate: "" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Investment Tracker</h1>
          <p className="text-muted-foreground">Track your portfolio performance</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Add Investment</button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Total Invested</p>
          <p className="text-xl font-bold">{formatINR(totalInvested)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Current Value</p>
          <p className="text-xl font-bold text-emerald-500">{formatINR(totalCurrent)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Total Returns</p>
          <p className={`text-xl font-bold flex items-center gap-1 ${totalReturn >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {totalReturn >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {formatINR(Math.abs(totalReturn))} ({totalReturnPct}%)
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Allocation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocation} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                {allocation.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} /><span className="text-muted-foreground">{a.name}</span></div>
                <span className="font-medium">{formatINR(a.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 rounded-2xl lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Portfolio Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#invGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Investment List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border"><h3 className="text-sm font-semibold">All Investments</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left p-4">Name</th><th className="text-left p-4">Type</th><th className="text-right p-4">Invested</th>
              <th className="text-right p-4">Current</th><th className="text-right p-4">Returns</th><th className="text-right p-4">P&L</th><th className="p-4"></th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {investments.map((inv) => {
                const ret = inv.currentValue - inv.amountInvested;
                const retPct = inv.amountInvested > 0 ? ((ret / inv.amountInvested) * 100).toFixed(1) : "0";
                return (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 font-medium">{inv.name}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${TYPE_COLORS[inv.type]}15`, color: TYPE_COLORS[inv.type] }}>{TYPE_LABELS[inv.type] || inv.type}</span></td>
                    <td className="p-4 text-right">{formatINR(inv.amountInvested)}</td>
                    <td className="p-4 text-right font-medium">{formatINR(inv.currentValue)}</td>
                    <td className="p-4 text-right"><span className={ret >= 0 ? "text-emerald-500" : "text-rose-500"}>{retPct}%</span></td>
                    <td className="p-4 text-right"><span className={`font-medium ${ret >= 0 ? "text-emerald-500" : "text-rose-500"}`}>{ret >= 0 ? "+" : ""}{formatINR(ret)}</span></td>
                    <td className="p-4"><button onClick={() => removeInvestment(inv.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-all"><X className="w-3.5 h-3.5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Investment Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto glass-card p-6 rounded-2xl z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Add Investment</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Name</label><input type="text" value={newInv.name} onChange={(e) => setNewInv({ ...newInv, name: e.target.value })} className="input-field" placeholder="e.g. Axis Bluechip Fund" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Type</label>
                  <select value={newInv.type} onChange={(e) => setNewInv({ ...newInv, type: e.target.value })} className="input-field">
                    <option value="stocks">Stocks</option><option value="mutual_funds">Mutual Funds</option><option value="etf">ETFs</option>
                    <option value="gold">Gold</option><option value="crypto">Crypto</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1.5">Invested (₹)</label><input type="number" value={newInv.amountInvested || ""} onChange={(e) => setNewInv({ ...newInv, amountInvested: Number(e.target.value) })} className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1.5">Current Value (₹)</label><input type="number" value={newInv.currentValue || ""} onChange={(e) => setNewInv({ ...newInv, currentValue: Number(e.target.value) })} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1.5">Units</label><input type="number" step="0.01" value={newInv.units || ""} onChange={(e) => setNewInv({ ...newInv, units: Number(e.target.value) })} className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1.5">Purchase Date</label><input type="date" value={newInv.purchaseDate} onChange={(e) => setNewInv({ ...newInv, purchaseDate: e.target.value })} className="input-field" /></div>
                </div>
                <button onClick={handleAdd} className="btn-primary w-full py-3">Add Investment</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
