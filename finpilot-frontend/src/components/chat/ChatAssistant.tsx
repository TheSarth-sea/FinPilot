"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Calculator, Wallet, TrendingUp, PiggyBank } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "Budget Help", icon: Wallet, query: "How should I budget my salary?" },
  { label: "Investment Tips", icon: TrendingUp, query: "What are good investment options for beginners?" },
  { label: "EMI Info", icon: Calculator, query: "How is EMI calculated?" },
  { label: "Saving Tips", icon: PiggyBank, query: "How can I save more money?" },
];

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("budget") || lower.includes("50-30-20") || lower.includes("salary"))
    return "Great question! The 50-30-20 rule is a popular budgeting framework:\n\n• **50% Needs**: Rent, groceries, utilities, insurance\n• **30% Wants**: Dining out, entertainment, shopping\n• **20% Savings**: Emergency fund, SIPs, investments\n\nFor a salary of ₹75,000:\n• Needs: ₹37,500\n• Wants: ₹22,500\n• Savings: ₹15,000\n\nTip: Try to increase your savings rate by 2% every quarter!";
  if (lower.includes("invest") || lower.includes("sip") || lower.includes("mutual fund"))
    return "Here are investment options for Indian investors:\n\n• **SIP in Mutual Funds**: Start with ₹5,000/month in a flexi-cap fund\n• **PPF**: Tax-free returns, 15-year lock-in, great for retirement\n• **ELSS**: Tax-saving mutual funds with 3-year lock-in\n• **Gold**: Sovereign Gold Bonds for long-term\n• **FD**: For short-term goals (1-2 years)\n\n💡 Rule of thumb: Invest at least 20% of your income. Start early — a ₹10,000/month SIP at 12% for 30 years = ₹3.5 Cr!";
  if (lower.includes("emi") || lower.includes("loan"))
    return "EMI (Equated Monthly Installment) is calculated using:\n\n**EMI = P × r × (1+r)^n / ((1+r)^n - 1)**\n\nWhere:\n• P = Principal amount\n• r = Monthly interest rate (annual rate / 12 / 100)\n• n = Number of months\n\nExample: ₹50L home loan at 8.5% for 20 years:\n• EMI = ₹43,391/month\n• Total interest: ₹54.1L\n• Total payment: ₹1.04 Cr\n\n💡 Tip: Even a 0.5% lower rate saves ₹3-4L over the loan tenure!";
  if (lower.includes("save") || lower.includes("saving"))
    return "Here are proven strategies to save more:\n\n1. **Automate savings**: Set up auto-transfer on salary day\n2. **Track expenses**: Use FinPilot's expense tracker daily\n3. **Cut subscriptions**: Review and cancel unused services\n4. **Cook more**: Eating out costs 3-4x more than home cooking\n5. **24-hour rule**: Wait 24 hours before any purchase over ₹2,000\n6. **Emergency fund first**: Build 6 months of expenses\n7. **No-spend days**: Try 2-3 per week\n\n💡 Even saving ₹500/day = ₹1.5L/year!";
  if (lower.includes("tax") || lower.includes("80c"))
    return "Tax-saving options for FY 2025-26:\n\n**Section 80C (₹1.5L limit)**:\n• ELSS Mutual Funds (3yr lock-in)\n• PPF (15yr, tax-free)\n• EPF, Life Insurance, NPS\n\n**Section 80D**: Health Insurance (₹25K-₹1L)\n**Section 80CCD(1B)**: NPS extra ₹50K\n**Section 24**: Home loan interest up to ₹2L\n\n💡 Compare old vs new tax regime — use FinPilot calculators!";
  if (lower.includes("emergency") || lower.includes("fund"))
    return "Your emergency fund should be:\n\n• **Target**: 6 months of monthly expenses\n• **Where to keep it**: High-yield savings account or liquid mutual fund\n• **Don't invest it** in stocks or FDs with lock-in\n\nFor monthly expenses of ₹45,000:\n• Target: ₹2,70,000\n• If starting from 0, save ₹15,000/month → done in 18 months\n\n💡 This is your #1 financial priority before investing!";
  if (lower.includes("retirement"))
    return "Retirement planning essentials:\n\n• **Start early**: ₹10K/month at age 25 → ₹5.9 Cr at 60 (12% returns)\n• **Account for inflation**: Today's ₹50K = ₹2.3L in 25 years (6% inflation)\n• **Corpus rule**: Need 25-30x annual expenses\n• **Diversify**: EPF + PPF + NPS + Equity MFs\n\nUse FinPilot's Retirement Calculator for your personalized plan!";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! 👋 I'm your FinPilot AI assistant. I can help you with:\n\n• 📊 Budgeting advice\n• 💰 Investment planning\n• 🏠 EMI calculations\n• 🎯 Goal planning\n• 💡 Saving strategies\n\nWhat would you like to know?";
  return "That's a great question! While I'm focused on financial topics, here are some things I can help with:\n\n• Budget planning (50-30-20 rule)\n• Investment strategies (SIP, MF, stocks)\n• EMI and loan calculations\n• Tax-saving tips\n• Emergency fund planning\n• Retirement planning\n\nTry asking about any of these topics!";
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi! 👋 I'm your FinPilot AI assistant. Ask me anything about personal finance, budgeting, investments, or tax saving!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    const response = getResponse(text);
    setMessages((prev) => [...prev, { id: `a${Date.now()}`, role: "assistant", content: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">FinPilot AI</p>
                <p className="text-xs text-emerald-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button key={action.label} onClick={() => sendMessage(action.query)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    <action.icon className="w-3 h-3 text-emerald-500" /> {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about finance..." className="input-field py-2.5 text-sm flex-1" />
                <button type="submit" disabled={!input.trim()} className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-40 hover:shadow-lg transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
