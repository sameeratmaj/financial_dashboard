import {
  BadgeDollarSign,
  ChevronRight,
  Lightbulb,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRef, useSyncExternalStore } from 'react';
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
  {
    key: 'largestExpense',
    title: 'Largest Expense',
    icon: ReceiptText,
  },
  {
    key: 'spendingPace',
    title: 'Spending Pace',
    icon: TrendingUp,
  },
  {
    key: 'highestIncome',
    title: 'Highest Income',
    icon: BadgeDollarSign,
  },
];

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

function InsightCard({ card, text }) {
  const Icon = card.icon;
  return (
    <article
      className="w-[min(calc(100vw_-_2.5rem),20rem)] shrink-0 rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 sm:w-[22rem] sm:rounded-[28px] sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          <Icon size={18} />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{card.title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </article>
  );
}

function InsightsSectionHeader({ showSeeAll }) {
  const { activeView, setActiveView } = useFinance();

  return (
    <div className="mb-5 flex items-start justify-between gap-3 px-1 laptop:items-center">
      <div>
        <p className="text-sm text-slate-500">At-a-glance signals</p>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Insights</h3>
      </div>
      {showSeeAll && activeView !== 'insights' ? (
        <button
          type="button"
          onClick={() => setActiveView('insights')}
          className="inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          See all
          <ChevronRight size={18} />
        </button>
      ) : null}
    </div>
  );
}

export default function InsightsPanel() {
  const { insights } = useFinance();
  const reduceMotion = usePrefersReducedMotion();
  const scrollRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
  });

  const handlePointerDown = (event) => {
    if (!scrollRef.current) {
      return;
    }

    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scrollRef.current.scrollLeft,
    };

    scrollRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragStateRef.current.active || !scrollRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    scrollRef.current.scrollLeft = dragStateRef.current.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event) => {
    if (!scrollRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    scrollRef.current.releasePointerCapture(event.pointerId);
  };

  if (reduceMotion) {
    return (
      <section className="rounded-3xl border border-white/60 bg-white/40 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/50 sm:rounded-[32px] sm:p-5">
        <InsightsSectionHeader showSeeAll />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {insightCards.map((card) => (
            <InsightCard key={card.key} card={card} text={insights[card.key]} />
          ))}
        </div>
      </section>
    );
  }

  const loopItems = [...insightCards, ...insightCards];

  return (
    <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/50 sm:rounded-[32px] sm:p-5">
      <InsightsSectionHeader showSeeAll />

      <div
        ref={scrollRef}
        className="insights-marquee-scroll insights-marquee-mask relative -mx-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="insights-marquee-track flex gap-4 px-2 py-1">
          {loopItems.map((card, index) => (
            <InsightCard
              key={`${card.key}-${index}`}
              card={card}
              text={insights[card.key]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
