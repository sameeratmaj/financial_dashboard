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

const shortDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const longDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
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

const getYearKey = (date) => String(new Date(date).getFullYear());

const getYearLabel = (yearKey) => yearKey;

const getDayKey = (date) => new Date(date).toISOString().slice(0, 10);

const getDayLabel = (dayKey) => longDayFormatter.format(new Date(`${dayKey}T00:00:00`));

const getWeekStart = (date) => {
  const value = new Date(date);
  const normalized = new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);
  return normalized;
};

const getWeekKey = (date) => {
  const weekStart = getWeekStart(date);
  return weekStart.toISOString().slice(0, 10);
};

const getWeekLabel = (weekKey) => {
  const weekStart = new Date(`${weekKey}T00:00:00`);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return `${shortDayFormatter.format(weekStart)} - ${shortDayFormatter.format(weekEnd)}`;
};

const buildTrendConfig = (range) => {
  switch (range) {
    case 'daily':
      return {
        keyName: 'dayKey',
        getKey: getDayKey,
        getLabel: getDayLabel,
      };
    case 'weekly':
      return {
        keyName: 'weekKey',
        getKey: getWeekKey,
        getLabel: getWeekLabel,
      };
    case 'yearly':
      return {
        keyName: 'yearKey',
        getKey: getYearKey,
        getLabel: getYearLabel,
      };
    case 'monthly':
    default:
      return {
        keyName: 'monthKey',
        getKey: getMonthKey,
        getLabel: getMonthLabel,
      };
  }
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

export const getTrendData = (transactions, range = 'monthly') => {
  const { keyName, getKey, getLabel } = buildTrendConfig(range);
  const grouped = new Map();

  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((transaction) => {
      const key = getKey(transaction.date);
      const period = grouped.get(key) ?? {
        [keyName]: key,
        label: getLabel(key),
        income: 0,
        expenses: 0,
        balance: 0,
      };

      if (transaction.type === 'income') {
        period.income += transaction.amount;
      } else {
        period.expenses += transaction.amount;
      }

      period.balance = period.income - period.expenses;
      grouped.set(key, period);
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
  const trendData = getTrendData(transactions, 'monthly');
  const currentMonth = trendData.at(-1);
  const previousMonth = trendData.at(-2);
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense'
  );
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income'
  );
  const largestExpense = expenseTransactions.reduce(
    (largest, transaction) =>
      !largest || transaction.amount > largest.amount ? transaction : largest,
    null
  );
  const averageExpense =
    expenseTransactions.length > 0
      ? expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0) /
        expenseTransactions.length
      : 0;
  const spendingPace = averageExpense
    ? `Average expense size is ${formatCurrency(averageExpense)} across ${expenseTransactions.length} transactions.`
    : 'Add some expense entries to understand your average spending pace.';
  const highestIncome = incomeTransactions.reduce(
    (largest, transaction) =>
      !largest || transaction.amount > largest.amount ? transaction : largest,
    null
  );

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
    largestExpense: largestExpense
      ? `Largest expense was ${formatCurrency(largestExpense.amount)} for ${largestExpense.description} on ${formatDisplayDate(largestExpense.date)}.`
      : 'No expense activity yet to identify your largest outgoing transaction.',
    spendingPace,
    highestIncome: highestIncome
      ? `Largest income entry was ${formatCurrency(highestIncome.amount)} from ${highestIncome.description} on ${formatDisplayDate(highestIncome.date)}.`
      : 'No income activity yet to highlight your strongest inflow.',
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
