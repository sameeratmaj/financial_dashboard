import { Moon, Plus, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Navbar() {
  const { currentRole, openAddModal, theme, toggleTheme } = useFinance();

  return (
    <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:mb-8 sm:rounded-[32px] sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 sm:text-sm md:text-sm">
          Professional finance command center
        </p>
        <h2 className="mt-1 text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-50 sm:text-3xl sm:leading-normal">
          Financial Dashboard
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden min-h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800 dark:hover:text-amber-100 sm:inline-flex"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon size={20} strokeWidth={2} />
          ) : (
            <Sun size={20} strokeWidth={2} />
          )}
        </button>

        {currentRole === 'admin' ? (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        ) : (
          <div className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Read-only mode
          </div>
        )}
      </div>
    </header>
  );
}
