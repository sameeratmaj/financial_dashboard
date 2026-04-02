import { Download, Pencil, Search, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  downloadFile,
  exportTransactionsAsCsv,
  formatCurrency,
  formatDisplayDate,
} from '../utils/finance';

export default function TransactionTable() {
  const {
    categories,
    currentRole,
    currentDarkPalette,
    deleteTransaction,
    filteredTransactions,
    filters,
    openEditModal,
    setFilter,
    theme,
  } = useFinance();

  const exportAsJson = () => {
    downloadFile(
      JSON.stringify(filteredTransactions, null, 2),
      'transactions-export.json',
      'application/json'
    );
  };

  const exportAsCsv = () => {
    downloadFile(
      exportTransactionsAsCsv(filteredTransactions),
      'transactions-export.csv',
      'text/csv;charset=utf-8'
    );
  };

  return (
    <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 sm:rounded-[32px] sm:p-5">
      <div className="mb-4 flex flex-col gap-4 sm:mb-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-slate-500">Transactions</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Search, filter, sort, and manage cash flow
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={exportAsCsv}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportAsJson}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-5 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
            placeholder="Search by description"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
          />
        </label>

        <select
          value={filters.category}
          onChange={(event) => setFilter('category', event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(event) => setFilter('type', event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => setFilter('sortBy', event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/70">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            No transactions found
          </h4>
          <p className="mt-2 text-sm text-slate-500">
            Try adjusting the search term or filter combination.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto overscroll-x-contain rounded-[28px] border border-slate-200/80 [-webkit-overflow-scrolling:touch] dark:border-slate-800 md:block">
            <table className="w-full min-w-[40rem] lg:min-w-0">
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
                {filteredTransactions.map((transaction) => (
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
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                        }`}
                        style={
                          transaction.type === 'income' && theme === 'dark'
                            ? {
                                backgroundColor: currentDarkPalette.soft,
                                color: currentDarkPalette.text,
                              }
                            : undefined
                        }
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
            {filteredTransactions.map((transaction) => (
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
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                    }`}
                    style={
                      transaction.type === 'income' && theme === 'dark'
                        ? {
                            backgroundColor: currentDarkPalette.soft,
                            color: currentDarkPalette.text,
                          }
                        : undefined
                    }
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
