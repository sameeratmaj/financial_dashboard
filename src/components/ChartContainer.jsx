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
import { useFinance } from '../context/FinanceContext';
import { formatCompactCurrency, formatCurrency } from '../utils/finance';

const COLORS = ['#0f172a', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function ChartContainer() {
  const { trendData, categoryBreakdown } = useFinance();

  return (
    <>
      <section className="rounded-[32px] border border-white/60 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 lg:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Time-based visualization</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Balance Trend
            </h3>
          </div>
          <p className="text-sm text-slate-500">Monthly net position</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={formatCompactCurrency} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  backgroundColor: 'rgba(255,255,255,0.96)',
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Categorical visualization</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Spending by Category
          </h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={2}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
