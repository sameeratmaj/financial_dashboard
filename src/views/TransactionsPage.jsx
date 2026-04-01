import TransactionList from '../components/TransactionList';

const TransactionsPage = () => {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">All transactions sorted by recency</p>
      </header>

      <TransactionList limit={null} showToggle={false} />
    </div>
  );
};

export default TransactionsPage;
