import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Moon,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export default function Sidebar() {
  const { activeView, setActiveView, currentRole, theme, toggleTheme } = useFinance();

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-white/60 bg-white/75 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-400 dark:text-slate-950">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Zorvyn</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              VaultBoard
            </h1>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 dark:bg-emerald-400 dark:text-slate-950'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={18} />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {currentRole === 'admin' ? 'Admin workspace' : 'Viewer workspace'}
              </p>
              <p className="text-xs text-slate-500">
                {currentRole === 'admin' ? 'Full control enabled' : 'Read-only access'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>{theme === 'dark' ? 'Dark mode enabled' : 'Switch to dark mode'}</span>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </aside>

      <div className="fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between rounded-[28px] border border-white/60 bg-white/90 px-3 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                active
                  ? 'bg-slate-900 text-white dark:bg-emerald-400 dark:text-slate-950'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
