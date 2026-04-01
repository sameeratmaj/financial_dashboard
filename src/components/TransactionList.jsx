import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTransaction } from '../features/finance/financeSlice';

const emptyEditForm = () => ({
  amount: '',
  category: '',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
});

const TransactionList = ({ limit = 5, showToggle = true, onShowMoreClick }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const { transactions, role } = useSelector((state) => state.finance);

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [transactions]
  );

  const hasLimit = Number.isInteger(limit) && limit > 0;
  const showFullList = !hasLimit || (isExpanded && !onShowMoreClick);
  const visibleTransactions = showFullList
    ? sortedTransactions
    : sortedTransactions.slice(0, limit);

  const hiddenCount = hasLimit ? Math.max(sortedTransactions.length - limit, 0) : 0;
  const hasMoreTransactions = showToggle && hiddenCount > 0;

  const openEdit = (t) => {
    setEditingId(t.id);
    setEditForm({
      amount: String(t.amount),
      category: t.category,
      type: t.type,
      date: t.date,
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm(emptyEditForm());
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const amount = Number.parseFloat(editForm.amount);
    if (Number.isNaN(amount) || amount <= 0) return;

    const category = editForm.category.trim() || 'Misc';
    if (editForm.type !== 'income' && editForm.type !== 'expense') return;

    dispatch(
      updateTransaction({
        id: editingId,
        date: editForm.date,
        amount,
        category,
        type: editForm.type,
      })
    );
    closeEdit();
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 transition-colors">
      <div className={`transition-all duration-200 ${editingId !== null ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-gray-700 dark:text-gray-300">Date</th>
                <th className="p-4 text-gray-700 dark:text-gray-300">Category</th>
                <th className="p-4 text-gray-700 dark:text-gray-300">Amount</th>
                {role === 'admin' && <th className="p-4 text-gray-700 dark:text-gray-300">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 text-gray-700 dark:text-gray-200">{t.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-200">
                      {t.category}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount}
                  </td>
                  {role === 'admin' && (
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasMoreTransactions && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                if (onShowMoreClick) {
                  onShowMoreClick();
                  return;
                }
                setIsExpanded((prev) => !prev);
              }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {onShowMoreClick
                ? `Show More (${hiddenCount} more)`
                : isExpanded
                  ? 'Show Less'
                  : `Show More (${hiddenCount} more)`}
            </button>
          </div>
        )}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 pointer-events-auto"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Transaction</h3>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={editForm.amount}
                onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                required
                value={editForm.category}
                onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  required
                  value={editForm.date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
