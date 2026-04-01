const StatCard = ({ title, amount, type }) => {
    // We keep the semantic colors (green/red) but can slightly brighten them for dark mode if needed
    const colorClass = 
      type === 'income' ? 'text-green-600 dark:text-green-400' : 
      type === 'expense' ? 'text-red-600 dark:text-red-400' : 
      'text-blue-600 dark:text-blue-400';
    
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
          {title}
        </p>
        <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
          ${amount.toLocaleString()}
        </p>
      </div>
    );
  };
  
  export default StatCard;