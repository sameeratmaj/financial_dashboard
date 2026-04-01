import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, setRole } from '../features/finance/financeSlice';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';

const Dashboard = ({ onViewAllTransactions }) => {
  const dispatch = useDispatch();
  const { role, transactions } = useSelector(state => state.finance);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().slice(0, 10),
  });

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += curr.amount;
    else acc.expense += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amount = Number.parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const category = formData.category.trim() || 'Misc';
    if (formData.type !== 'income' && formData.type !== 'expense') {
      return;
    }

    const maxId = transactions.reduce((max, t) => Math.max(max, t.id), 0);
    dispatch(addTransaction({
      id: maxId + 1,
      date: formData.date,
      amount,
      category,
      type: formData.type,
    }));

    setFormData({
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="relative p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className={`transition-all duration-200 ${isModalOpen ? 'blur-sm' : ''}`}>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Financial Overview</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {role === 'admin' ? 'Admin' : 'Viewer'}</p>
          </div>
          
          {/* Role Switcher */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Role:</span>
            <select
              value={role}
              onChange={(e) => dispatch(setRole(e.target.value))}
              className="border-none focus:ring-0 text-blue-600 dark:text-blue-400 font-bold bg-transparent"
            >
              <option value="viewer" className="dark:bg-gray-800">Viewer</option>
              <option value="admin" className="dark:bg-gray-800">Admin</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Balance" amount={totals.income - totals.expense} type="balance" />
          <StatCard title="Total Income" amount={totals.income} type="income" />
          <StatCard title="Total Expenses" amount={totals.expense} type="expense" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Transactions</h2>
            <TransactionList onShowMoreClick={onViewAllTransactions} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Highest Spending</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Food ($150)</p>
              </div>
              {role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  + Add Transaction
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Add Transaction</h3>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
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
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

export default Dashboard;