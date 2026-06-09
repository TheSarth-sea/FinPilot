"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore } from "@/store";
import { formatINR } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Plus, X, Search, Receipt, TrendingDown, Calendar, Filter } from "lucide-react";

const categories = [
  { value: "all", label: "All", emoji: "📋" },
  { value: "food", label: "Food", emoji: "🍕" },
  { value: "rent", label: "Rent", emoji: "🏠" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "bills", label: "Bills", emoji: "💡" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "entertainment", label: "Fun", emoji: "🎬" },
];

export default function ExpensesPage() {
  const { expenses, addExpense, removeExpense } = useFinanceStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newExp, setNewExp] = useState({ amount: 0, category: "food", description: "", date: new Date().toISOString().split("T")[0] });

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => e.type !== "income")
      .filter((e) => filter === "all" || e.category === filter)
      .filter((e) => !search || e.description.toLowerCase().includes(search.toLowerCase()));
  }, [expenses, filter, search]);

  const totalThisMonth = filtered.reduce((s, e) => s + e.amount, 0);
  const dailyAvg = Math.round(totalThisMonth / new Date().getDate());

  // Category summary
  const categorySummary = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([cat, amount]) => ({
      category: categories.find((c) => c.value === cat)?.label || cat,
      amount,
    })).sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const handleAdd = () => {
    if (!newExp.amount || !newExp.description) return;
    addExpense({ ...newExp, date: new Date(newExp.date).toISOString(), type: "expense" });
    setShowModal(false);
    setNewExp({ amount: 0, category: "food", description: "", date: new Date().toISOString().split("T")[0] });
  };

  const getCatEmoji = (cat: string) => categories.find((c) => c.value === cat)?.emoji || "📦";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Expense Tracker</h1>
          <p className="text-muted-foreground">Track and categorize your spending</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Add Expense</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Total This Month</p>
          <p className="text-xl font-bold text-rose-500">{formatINR(totalThisMonth)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Daily Average</p>
          <p className="text-xl font-bold">{formatINR(dailyAvg)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="text-xl font-bold">{filtered.length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="input-field pl-9 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => setFilter(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === cat.value ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Transactions</h3>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {filtered.map((exp) => (
              <div key={exp.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors group">
                <span className="text-xl">{getCatEmoji(exp.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <span className="text-sm font-semibold text-rose-500">-{formatINR(exp.amount)}</span>
                <button onClick={() => removeExpense(exp.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categorySummary} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
              <Bar dataKey="amount" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto glass-card p-6 rounded-2xl z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Add Expense</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Amount (₹)</label>
                  <input type="number" value={newExp.amount || ""} onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })} className="input-field text-xl font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.slice(1).map((cat) => (
                      <button key={cat.value} onClick={() => setNewExp({ ...newExp, category: cat.value })}
                        className={`p-2 rounded-xl text-xs font-medium border transition-all ${newExp.category === cat.value ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-border hover:border-emerald-500/30"}`}>
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <input type="text" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} className="input-field" placeholder="What did you spend on?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input type="date" value={newExp.date} onChange={(e) => setNewExp({ ...newExp, date: e.target.value })} className="input-field" />
                </div>
                <button onClick={handleAdd} className="btn-primary w-full py-3">Add Expense</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
