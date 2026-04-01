import { Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const insightCards = [
  {
    key: 'topCategory',
    title: 'Highest Spending Category',
    icon: TrendingUp,
  },
  {
    key: 'monthlyComparison',
    title: 'Monthly Comparison',
    icon: TrendingDown,
  },
  {
    key: 'observation',
    title: 'Useful Observation',
    icon: Lightbulb,
  },
];

export default function InsightsPanel() {
  const { insights } = useFinance();

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {insightCards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.key}
            className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                <Icon size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {card.title}
              </h3>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {insights[card.key]}
            </p>
          </article>
        );
      })}
    </section>
  );
}
