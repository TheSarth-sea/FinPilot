"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore } from "@/store";
import { formatINR, GOAL_TYPES } from "@/lib/utils";
import { Target, Plus, X, Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, removeGoal } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", type: "HOUSE", targetAmount: 0, currentAmount: 0, deadline: "" });

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;
    const monthsLeft = Math.max(1, Math.ceil((new Date(newGoal.deadline).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)));
    addGoal({ ...newGoal, monthlyContribution: Math.round((newGoal.targetAmount - newGoal.currentAmount) / monthsLeft), deadline: newGoal.deadline });
    setShowModal(false);
    setNewGoal({ name: "", type: "HOUSE", targetAmount: 0, currentAmount: 0, deadline: "" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Goal Planner</h1>
          <p className="text-muted-foreground">Track & achieve your financial goals</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal, i) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
          const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
          const monthlyNeeded = Math.round((goal.targetAmount - goal.currentAmount) / monthsLeft);
          const isOnTrack = goal.monthlyContribution ? goal.monthlyContribution >= monthlyNeeded * 0.9 : pct > (100 - (daysLeft / 365 * 100));
          const goalType = GOAL_TYPES.find((t) => t.value.toLowerCase() === goal.type.toLowerCase());

          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 rounded-2xl group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goalType?.emoji || goal.icon || "🎯"}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{goal.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isOnTrack ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" : "bg-amber-100 dark:bg-amber-900/20 text-amber-600"}`}>
                      {isOnTrack ? <><CheckCircle className="w-3 h-3 inline mr-0.5" /> On Track</> : <><AlertCircle className="w-3 h-3 inline mr-0.5" /> Behind</>}
                    </span>
                  </div>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{formatINR(goal.currentAmount)}</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">{formatINR(goal.targetAmount)}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Monthly Needed</p>
                  <p className="font-semibold">{formatINR(monthlyNeeded)}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Days Left</p>
                  <p className="font-semibold">{daysLeft}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto glass-card p-6 rounded-2xl z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Add New Goal</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Goal Name</label>
                  <input type="text" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="e.g. Dream Home" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Goal Type</label>
                  <select value={newGoal.type} onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                    className="input-field">
                    {GOAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Target Amount (₹)</label>
                    <input type="number" value={newGoal.targetAmount || ""} onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Current Amount (₹)</label>
                    <input type="number" value={newGoal.currentAmount || ""} onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Deadline</label>
                  <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} className="input-field" />
                </div>
                <button onClick={handleAdd} className="btn-primary w-full py-3">Create Goal</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
