import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDisplayDate } from '../utils/finance';

export default function RecentTransactionsPreview() {
  const {
    currentRole,
    deleteTransaction,
    openEditModal,
    recentTransactions,
    setActiveView,
  } = useFinance();

  return (
    <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 sm:rounded-[32px] sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Recent activity</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Latest transactions
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('transactions')}
          className="inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          See more
          <ChevronRight size={18} />
        </button>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-sm text-slate-500">No transactions yet.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-slate-800 md:block">
            <table className="w-full">
              <thead className="bg-slate-50/90 dark:bg-slate-900/90">
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Description</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  {currentRole === 'admin' ? <th className="px-5 py-4 font-medium">Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-slate-200/70 text-sm text-slate-600 transition hover:bg-slate-50/80 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/80"
                  >
                    <td className="px-5 py-4">{formatDisplayDate(transaction.date)}</td>
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-50">
                      {transaction.description}
                    </td>
                    <td className="px-5 py-4">{transaction.category}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-50">
                      {formatCurrency(transaction.amount)}
                    </td>
                    {currentRole === 'admin' ? (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(transaction)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {recentTransactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">
                      {transaction.description}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDisplayDate(transaction.date)} • {transaction.category}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                    }`}
                  >
                    {transaction.type}
                  </span>
                  {currentRole === 'admin' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(transaction)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
