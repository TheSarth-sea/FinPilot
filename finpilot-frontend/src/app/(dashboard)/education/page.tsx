"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, Bookmark, BookMarked, GraduationCap, TrendingUp, Wallet, Shield, Landmark } from "lucide-react";

const articles = [
  {
    id: "1", title: "Personal Finance 101: Getting Started", category: "Basics", readTime: "5 min",
    icon: BookOpen, color: "from-emerald-500 to-green-500",
    content: "Personal finance is about managing your money effectively. Start by tracking your income and expenses, creating a budget, building an emergency fund (3-6 months of expenses), and then investing for the future. The key principles are: spend less than you earn, avoid high-interest debt, and start investing early to benefit from compounding.",
  },
  {
    id: "2", title: "The 50-30-20 Budgeting Rule Explained", category: "Budgeting", readTime: "4 min",
    icon: Wallet, color: "from-amber-500 to-orange-500",
    content: "The 50-30-20 rule divides your after-tax income into three categories: 50% for Needs (rent, food, utilities, insurance), 30% for Wants (entertainment, dining out, shopping), and 20% for Savings & Investments (emergency fund, SIP, retirement). This simple framework helps you balance enjoying life today while building wealth for tomorrow.",
  },
  {
    id: "3", title: "SIP vs Lumpsum: Which is Better?", category: "Investing", readTime: "6 min",
    icon: TrendingUp, color: "from-blue-500 to-cyan-500",
    content: "SIP (Systematic Investment Plan) involves investing a fixed amount regularly, which averages out market volatility through rupee cost averaging. Lumpsum investing puts all money at once, which can yield higher returns in a rising market. For beginners, SIP is recommended as it reduces timing risk and builds discipline. A combination of both often works best.",
  },
  {
    id: "4", title: "Tax-Saving Strategies for Salaried Indians", category: "Tax Saving", readTime: "7 min",
    icon: Shield, color: "from-violet-500 to-purple-500",
    content: "Key tax-saving options under the old regime: Section 80C (₹1.5L) — ELSS, PPF, EPF, NPS, Life Insurance, Tuition Fees. Section 80D — Health Insurance (₹25K-₹1L). Section 80CCD(1B) — Additional ₹50K for NPS. HRA exemption for rent payers. Home loan interest under Section 24. The new regime offers lower rates but fewer deductions — compare both to choose wisely.",
  },
  {
    id: "5", title: "Building Your First Emergency Fund", category: "Basics", readTime: "4 min",
    icon: Shield, color: "from-rose-500 to-pink-500",
    content: "An emergency fund is your financial safety net — typically 3-6 months of monthly expenses kept in a liquid, easily accessible account. Start small: aim for 1 month first, then build up. Keep it in a high-yield savings account or liquid mutual fund. Don't invest it in stocks or locked instruments. This fund protects you from job loss, medical emergencies, or unexpected repairs.",
  },
  {
    id: "6", title: "Retirement Planning: Start Early, Retire Rich", category: "Retirement", readTime: "8 min",
    icon: Landmark, color: "from-teal-500 to-emerald-500",
    content: "The power of compounding makes early retirement planning incredibly powerful. Starting at 25 with ₹10,000/month at 12% returns gives you ₹5.9 Cr by 60. Starting at 35 gives only ₹1.7 Cr. Use a mix of EPF, PPF, NPS, and equity mutual funds. Factor in inflation (6-7% in India) when calculating your retirement corpus. The rule of thumb: you need 25-30x your annual expenses at retirement.",
  },
  {
    id: "7", title: "Understanding Mutual Fund Categories", category: "Investing", readTime: "6 min",
    icon: TrendingUp, color: "from-indigo-500 to-blue-500",
    content: "Mutual funds are categorized by SEBI into: Equity (large-cap, mid-cap, small-cap, flexi-cap, ELSS), Debt (liquid, ultra-short, corporate bond, gilt), Hybrid (balanced advantage, aggressive), and Index/ETF. For beginners, start with a flexi-cap fund via SIP. Large-cap for stability, mid/small-cap for growth. Debt funds for short-term goals. Always check the expense ratio and fund manager track record.",
  },
  {
    id: "8", title: "Credit Score: Why It Matters & How to Improve", category: "Basics", readTime: "5 min",
    icon: BookOpen, color: "from-cyan-500 to-blue-500",
    content: "Your CIBIL score (300-900) affects loan approvals and interest rates. A score above 750 is considered good. To improve: always pay credit card bills in full and on time, keep credit utilization below 30%, don't apply for multiple loans simultaneously, maintain old credit accounts, and regularly check your CIBIL report for errors. A good score can save you lakhs in interest over a home loan tenure.",
  },
];

const categories = ["All", "Basics", "Budgeting", "Investing", "Tax Saving", "Retirement"];

export default function EducationPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return articles
      .filter((a) => activeCategory === "All" || a.category === activeCategory)
      .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()));
  }, [activeCategory, search]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2"><GraduationCap className="w-8 h-8 text-emerald-500" /> Financial Education</h1>
        <p className="text-muted-foreground">Learn to make smarter money decisions</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="input-field pl-9 py-2.5" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((article, i) => (
          <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center`}>
                  <article.icon className="w-5 h-5 text-white" />
                </div>
                <button onClick={() => toggleBookmark(article.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  {bookmarks.has(article.id) ? <BookMarked className="w-4 h-4 text-emerald-500" /> : <Bookmark className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{article.category}</span>
              <h3 className="text-base font-semibold mt-1 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{article.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                <button onClick={() => setExpandedId(expandedId === article.id ? null : article.id)} className="text-xs text-emerald-500 font-medium hover:underline">
                  {expandedId === article.id ? "Show less" : "Read more"}
                </button>
              </div>
              {expandedId === article.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.content}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
