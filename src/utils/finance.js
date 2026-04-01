const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

export const formatCurrency = (value) => currencyFormatter.format(value ?? 0);

export const formatCompactCurrency = (value) =>
  compactCurrencyFormatter.format(value ?? 0);

export const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));

export const getMonthKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return monthFormatter.format(new Date(year, month - 1, 1));
};

export const getSummaryTotals = (transactions) =>
  transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }

      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );

export const getTrendData = (transactions) => {
  const grouped = new Map();

  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((transaction) => {
      const key = getMonthKey(transaction.date);
      const month = grouped.get(key) ?? {
        monthKey: key,
        label: getMonthLabel(key),
        income: 0,
        expenses: 0,
        balance: 0,
      };

      if (transaction.type === 'income') {
        month.income += transaction.amount;
      } else {
        month.expenses += transaction.amount;
      }

      month.balance = month.income - month.expenses;
      grouped.set(key, month);
    });

  return [...grouped.values()];
};

export const getCategoryBreakdown = (transactions) => {
  const categoryTotals = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
      return acc;
    }, {});

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getInsights = (transactions) => {
  const expenseCategories = getCategoryBreakdown(transactions);
  const topCategory = expenseCategories[0];
  const trendData = getTrendData(transactions);
  const currentMonth = trendData.at(-1);
  const previousMonth = trendData.at(-2);

  const monthlyComparison = (() => {
    if (!currentMonth || !previousMonth || previousMonth.expenses === 0) {
      return 'Not enough monthly history yet to compare spending trends.';
    }

    const diff = currentMonth.expenses - previousMonth.expenses;
    const percentage = Math.abs((diff / previousMonth.expenses) * 100).toFixed(0);

    if (diff === 0) {
      return `Spending is flat versus ${previousMonth.label}.`;
    }

    return diff > 0
      ? `Spent ${percentage}% more than ${previousMonth.label}.`
      : `Spent ${percentage}% less than ${previousMonth.label}.`;
  })();

  const currentMonthTransactions = currentMonth
    ? transactions.filter((transaction) => getMonthKey(transaction.date) === currentMonth.monthKey)
    : [];

  const currentMonthTotals = getSummaryTotals(currentMonthTransactions);
  const savingsRate =
    currentMonthTotals.income > 0
      ? Math.max(
          0,
          Math.round(
            ((currentMonthTotals.income - currentMonthTotals.expenses) /
              currentMonthTotals.income) *
              100
          )
        )
      : 0;

  return {
    topCategory: topCategory
      ? `${topCategory.name} leads spending at ${formatCurrency(topCategory.value)}.`
      : 'No expense activity yet to identify a leading category.',
    monthlyComparison,
    observation: currentMonth
      ? `You have saved ${savingsRate}% of your income in ${currentMonth.label}.`
      : 'Add transactions to unlock spending observations.',
  };
};

export const filterAndSortTransactions = (transactions, filters) => {
  const query = filters.search.trim().toLowerCase();

  return [...transactions]
    .filter((transaction) => {
      const matchesSearch =
        query.length === 0 ||
        transaction.description.toLowerCase().includes(query);
      const matchesCategory =
        filters.category === 'all' || transaction.category === filters.category;
      const matchesType =
        filters.type === 'all' || transaction.type === filters.type;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
};

export const exportTransactionsAsCsv = (transactions) => {
  const header = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.amount,
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(',')
    )
    .join('\n');
};

export const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
