import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function TransactionModal() {
  const { modal, categories, closeModal, updateForm, saveTransaction } = useFinance();
  const [error, setError] = useState('');

  if (!modal.open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = saveTransaction();

    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center overflow-y-auto overflow-x-hidden bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="mb-0 w-full max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom)-1rem))] max-w-xl overflow-y-auto overflow-x-hidden rounded-t-[28px] border border-white/60 border-b-0 bg-white shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950 sm:mb-0 sm:max-h-[min(88dvh,720px)] sm:rounded-[32px] sm:border-b">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
          <div>
            <p className="text-sm text-slate-500">
              {modal.mode === 'edit' ? 'Update existing entry' : 'Create a new transaction'}
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
              {modal.mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 sm:pb-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
              <input
                type="date"
                value={modal.form.date}
                onChange={(event) => {
                  setError('');
                  updateForm('date', event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Amount</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={modal.form.amount}
                onChange={(event) => {
                  setError('');
                  updateForm('amount', event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                placeholder="1250"
                required
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
            <input
              type="text"
              value={modal.form.description}
              onChange={(event) => {
                setError('');
                updateForm('description', event.target.value);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
              placeholder="April salary credit"
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
              <input
                list="category-options"
                value={modal.form.category}
                onChange={(event) => {
                  setError('');
                  updateForm('category', event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                placeholder="Groceries"
                required
              />
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Type</span>
              <select
                value={modal.form.type}
                onChange={(event) => {
                  setError('');
                  updateForm('type', event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
            >
              {modal.mode === 'edit' ? 'Save changes' : 'Create transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
