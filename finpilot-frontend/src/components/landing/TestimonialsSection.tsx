"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, Bangalore",
    avatar: "PS",
    rating: 5,
    text: "FinPilot completely changed how I manage my money. The SIP calculator helped me plan my investments, and the goal tracker keeps me motivated. I've saved ₹3 lakhs more this year!",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Rahul Verma",
    role: "Business Owner, Mumbai",
    avatar: "RV",
    rating: 5,
    text: "As a business owner, tracking personal and business finances was chaotic. FinPilot's dashboard gives me a clear picture instantly. The budget planner is a game-changer.",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Ananya Patel",
    role: "Doctor, Delhi",
    avatar: "AP",
    rating: 5,
    text: "I was clueless about investments before FinPilot. The retirement calculator showed me I needed to start early, and now I have a clear roadmap. Highly recommend!",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Vikram Singh",
    role: "CA, Pune",
    avatar: "VS",
    rating: 5,
    text: "Even as a chartered accountant, I find FinPilot incredibly useful for personal finance. The EMI calculator and debt payoff planner are best-in-class. Clean UI too!",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "Sneha Reddy",
    role: "Teacher, Hyderabad",
    avatar: "SR",
    rating: 5,
    text: "The 50-30-20 budget feature helped me understand where my salary goes. Now I save consistently every month. The app feels premium and is so easy to use!",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Arjun Mehta",
    role: "Freelancer, Jaipur",
    avatar: "AM",
    rating: 5,
    text: "With irregular income, budgeting was tough. FinPilot's expense tracker and goal planner made it simple. I can now plan for my dream home with confidence.",
    color: "from-teal-500 to-green-500",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prev = () => goTo((activeIndex - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((activeIndex + 1) % testimonials.length);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/20 dark:via-violet-950/10 to-transparent pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            Loved by Thousands
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            What Our Users{" "}
            <span className="gradient-text-secondary">Say About Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 50,000+ Indians who are already making smarter financial decisions with FinPilot.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-14 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-14 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass-card p-8 sm:p-10 rounded-2xl text-center"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-emerald-500/20 dark:text-emerald-400/20 mx-auto mb-4" />

                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[activeIndex].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[activeIndex].color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{testimonials[activeIndex].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 h-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
                    : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
