import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { formatCompactCurrency, formatCurrency } from '../utils/finance';
import { darkPalettes } from '../utils/theme';

/** Vibrant, saturated slices for light mode */
const PIE_COLORS_LIGHT = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
];

/** Luminous slices — readable pop on dark backgrounds */
const PIE_COLORS_DARK = [
  darkPalettes.cobalt.accent,
  '#fcd34d',
  '#38bdf8',
  '#f472b6',
  '#a78bfa',
  '#2dd4bf',
  '#fb923c',
];

export default function ChartContainer() {
  const { categoryBreakdown, currentDarkPalette, theme, trendData, trendRange, setTrendRange } =
    useFinance();
  const isPhone = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');

  const pieColors = useMemo(
    () =>
      theme === 'dark'
        ? [currentDarkPalette.accent, ...PIE_COLORS_DARK.slice(1)]
        : PIE_COLORS_LIGHT,
    [currentDarkPalette.accent, theme]
  );

  const pieInner = isPhone ? 44 : isTablet ? 52 : 58;
  const pieOuter = isPhone ? 74 : isTablet ? 86 : 92;
  const tickFont = isPhone ? 10 : 12;
  const areaMargins = isPhone
    ? { top: 4, right: 2, left: 0, bottom: 8 }
    : isTablet
      ? { top: 8, right: 8, left: 0, bottom: 8 }
      : { top: 8, right: 16, left: 0, bottom: 8 };
  const trendRangeLabels = {
    daily: 'Daily net position',
    weekly: 'Weekly net position',
    monthly: 'Monthly net position',
    yearly: 'Yearly net position',
  };

  return (
    <>
      <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 sm:rounded-[32px] sm:p-5 lg:col-span-2">
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 sm:text-sm">Time-based visualization</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
              Balance Trend
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-slate-500 sm:text-sm">
              {trendRangeLabels[trendRange]}
            </span>
            <select
              value={trendRange}
              onChange={(event) => setTrendRange(event.target.value)}
              className="min-w-[7.5rem] cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus-visible:ring-slate-600 sm:text-sm"
              aria-label="Select trend range"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="h-52 sm:h-64 md:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={areaMargins}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme === 'dark' ? currentDarkPalette.accent : '#10b981'}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme === 'dark' ? currentDarkPalette.accent : '#10b981'}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: tickFont }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#64748b"
                width={isPhone ? 40 : isTablet ? 48 : 56}
                tick={{ fontSize: tickFont }}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={
                  theme === 'dark'
                    ? {
                        borderRadius: '16px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        color: '#f1f5f9',
                      }
                    : {
                        borderRadius: '16px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        backgroundColor: 'rgba(255,255,255,0.96)',
                      }
                }
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={theme === 'dark' ? currentDarkPalette.accent : '#10b981'}
                strokeWidth={3}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 sm:rounded-[32px] sm:p-5">
        <div className="mb-4 sm:mb-6">
          <p className="text-xs text-slate-500 sm:text-sm">Categorical visualization</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
            Spending by Category
          </h3>
        </div>

        <div className="h-56 sm:h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={pieInner}
                outerRadius={pieOuter}
                paddingAngle={2}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={
                  theme === 'dark'
                    ? {
                        borderRadius: '16px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        color: '#f1f5f9',
                      }
                    : {
                        borderRadius: '16px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        color: '#0f172a',
                      }
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {categoryBreakdown.slice(0, 5).map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
