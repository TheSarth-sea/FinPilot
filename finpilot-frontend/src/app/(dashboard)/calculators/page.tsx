'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

interface CalculatorCard {
  name: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
}

const calculators: CalculatorCard[] = [
  {
    name: 'EMI Calculator',
    description: 'Calculate your monthly loan EMI, total interest, and view amortization schedule.',
    href: '/calculators/emi',
    icon: '🏦',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'SIP Calculator',
    description: 'Plan your mutual fund SIP investments and visualize wealth growth over time.',
    href: '/calculators/sip',
    icon: '📈',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Lumpsum Calculator',
    description: 'Calculate returns on one-time investment with compound growth projection.',
    href: '/calculators/lumpsum',
    icon: '💰',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Retirement Calculator',
    description: 'Plan your retirement corpus, analyze gaps, and find how much more to save.',
    href: '/calculators/retirement',
    icon: '🏖️',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    name: 'Inflation Calculator',
    description: 'Understand how inflation erodes your purchasing power over the years.',
    href: '/calculators/inflation',
    icon: '📊',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    name: 'Compound Interest',
    description: 'Compare compounding frequencies and see how your money grows exponentially.',
    href: '/calculators/compound-interest',
    icon: '🔄',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    name: 'Home Affordability',
    description: 'Find out the maximum home price you can afford based on your income.',
    href: '/calculators/home-affordability',
    icon: '🏠',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    name: 'Car Affordability',
    description: 'Calculate max car price, EMI, insurance, and total ownership cost.',
    href: '/calculators/car-affordability',
    icon: '🚗',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    name: 'Debt Payoff',
    description: 'Compare Snowball vs Avalanche strategies to become debt-free faster.',
    href: '/calculators/debt-payoff',
    icon: '🎯',
    gradient: 'from-fuchsia-500 to-violet-500',
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Financial{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Calculators
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Powerful tools to plan your finances with precision.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {calculators.map((calc) => (
            <motion.div key={calc.href} variants={item}>
              <Link href={calc.href} className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700/50 dark:bg-gray-900/80">
                  {/* Gradient accent line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${calc.gradient} opacity-80 transition-all duration-300 group-hover:h-1.5`}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${calc.gradient} text-2xl shadow-lg`}
                    >
                      {calc.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {calc.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex justify-end">
                    <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-gray-600">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
