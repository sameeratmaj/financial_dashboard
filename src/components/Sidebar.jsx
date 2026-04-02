import {
  BarChart3,
  CreditCard,
  Headset,
  LayoutDashboard,
  LineChart,
  Settings,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'holdings', label: 'Holdings', icon: Wallet },
  { id: 'risk-assessments', label: 'Risk Assessments', icon: TriangleAlert },
  { id: 'markets', label: 'Markets', icon: LineChart },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'support', label: 'Support', icon: Headset },
];

const mobileNavItems = navItems.filter(
  (item) =>
    !['transactions', 'risk-assessments', 'insights', 'support'].includes(item.id)
);

export default function Sidebar() {
  const { activeView, currentDarkPalette, setActiveView, theme } = useFinance();

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-white/60 bg-white/75 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:sticky lg:top-0 lg:z-20 lg:flex lg:h-screen lg:max-h-screen lg:flex-col lg:overflow-y-auto">
        <div className="mb-8 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"
            style={
              theme === 'dark'
                ? { backgroundColor: currentDarkPalette.accent, color: '#fff' }
                : undefined
            }
          >
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
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50'
                }`}
                style={
                  active && theme === 'dark'
                    ? { backgroundColor: currentDarkPalette.accent, color: '#fff' }
                    : undefined
                }
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="mobile-dock-nav fixed inset-x-0 bottom-0 z-30 flex w-full gap-1 overflow-x-auto overscroll-x-contain border-t border-white/60 bg-white/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-2xl shadow-slate-900/10 backdrop-blur-lg [scrollbar-width:none] dark:border-slate-800 dark:bg-slate-950/95 sm:px-3 lg:hidden [&::-webkit-scrollbar]:hidden">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex min-w-[3.25rem] flex-1 shrink-0 flex-col items-center justify-center gap-0.1 rounded-2xl px-1.5 py-2 text-[9px] font-medium leading-tight transition sm:min-w-0 sm:gap-1 sm:px-2 sm:text-[10px] ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              style={
                active && theme === 'dark'
                  ? { backgroundColor: currentDarkPalette.accent, color: '#fff' }
                  : undefined
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-center leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
