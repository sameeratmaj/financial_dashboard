import { Eye, Moon, Settings, ShieldCheck, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { darkPalettes } from '../utils/theme';

export default function SettingsPanel() {
  const {
    currentDarkPalette,
    currentRole,
    darkPalette,
    setDarkPalette,
    setRole,
    theme,
    toggleTheme,
  } = useFinance();

  return (
    <section className="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:space-y-6 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white"
          style={
            theme === 'dark'
              ? { backgroundColor: currentDarkPalette.accent, color: '#fff' }
              : undefined
          }
        >
          <Settings size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            Workspace Settings
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Preferences
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Manage dashboard access and appearance from one place across desktop and
            mobile.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Appearance
          </p>
          <h4 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            Theme mode
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Switch between light and dark mode from settings on any screen size.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`rounded-3xl border p-5 text-left transition ${
              theme === 'light'
                ? 'border-sky-300 bg-sky-50 shadow-lg shadow-sky-500/10 dark:border-sky-400/40 dark:bg-sky-500/10'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
                <Sun size={20} />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Light</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Bright workspace for daytime viewing.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`rounded-3xl border p-5 text-left transition ${
              theme === 'dark'
                ? 'border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:border-indigo-400/40 dark:bg-indigo-500/10'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300">
                <Moon size={20} />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Dark</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Reduced-glare interface for low-light use.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {theme === 'dark' ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Dark Palette
            </p>
            <h4 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
              Accent color
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Choose the accent palette used in dark mode. The selected color updates
              navigation, buttons, charts, and highlights.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.values(darkPalettes).map((palette) => {
              const selected = darkPalette === palette.key;
              return (
                <button
                  key={palette.key}
                  type="button"
                  onClick={() => setDarkPalette(palette.key)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    selected
                      ? 'border-slate-300 bg-slate-50 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/70'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${palette.accent}, ${palette.gradientMid}, ${palette.gradientEnd})`,
                      }}
                    />
                    <div>
                      <h5 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        {palette.name}
                      </h5>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {palette.accent}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Permissions
          </p>
          <h4 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            Access mode
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose whether this dashboard can edit transactions or stay in a read-only
            viewing state.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <button
          type="button"
          onClick={() => setRole('admin')}
          className={`rounded-3xl border p-5 text-left transition ${
            currentRole === 'admin'
              ? 'border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-500/10'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
          }`}
          style={
            currentRole === 'admin' && theme === 'dark'
              ? {
                  borderColor: currentDarkPalette.border,
                  backgroundColor: currentDarkPalette.soft,
                }
              : undefined
          }
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600"
              style={
                theme === 'dark'
                  ? {
                      backgroundColor: currentDarkPalette.soft,
                      color: currentDarkPalette.text,
                    }
                  : undefined
              }
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Admin</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Full access to add, edit, and delete transactions.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole('viewer')}
          className={`rounded-3xl border p-5 text-left transition ${
            currentRole === 'viewer'
              ? 'border-amber-300 bg-amber-50 shadow-lg shadow-amber-500/10 dark:border-amber-400/40 dark:bg-amber-500/10'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
              <Eye size={20} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Viewer</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Read-only access for browsing and reviewing data.
              </p>
            </div>
          </div>
        </button>
        </div>
      </div>
    </section>
  );
}
