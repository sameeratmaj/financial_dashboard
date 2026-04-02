import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    accent: 'from-slate-900 via-slate-800 to-slate-700 text-white dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-200 dark:text-slate-950',
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: ArrowUpRight,
    accent: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: ArrowDownRight,
    accent: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
  },
];

export default function SummaryCards() {
  const { summary } = useFinance();

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key];

        return (
          <article
            key={card.key}
            className={`rounded-3xl p-4 shadow-xl shadow-slate-900/5 sm:rounded-[28px] sm:p-5 ${
              card.key === 'balance'
                ? `bg-gradient-to-br ${card.accent}`
                : `border border-white/60 ${card.accent}`
            }`}
          >
            <div className="mb-6 flex items-start justify-between sm:mb-10">
              <div className="min-w-0 pr-2">
                <p className="text-xs text-current/70 sm:text-sm">{card.label}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl">
                  {formatCurrency(value)}
                </h3>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 dark:bg-slate-950/10">
                <Icon size={20} />
              </div>
            </div>
            <p className="text-sm text-current/70">
              {card.key === 'balance'
                ? 'Net liquidity across all recorded cash flow.'
                : card.key === 'income'
                  ? 'All incoming cash sources combined.'
                  : 'Operational and lifestyle outflow combined.'}
            </p>
          </article>
        );
      })}
    </section>
  );
}
