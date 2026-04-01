/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import {
  filterAndSortTransactions,
  getCategoryBreakdown,
  getInsights,
  getSummaryTotals,
  getTrendData,
} from '../utils/finance';

const STORAGE_KEY = 'zorvyn-finance-dashboard';

const FinanceContext = createContext(null);

const defaultFilters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date-desc',
};

const defaultForm = {
  id: null,
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: 'Groceries',
  type: 'expense',
  description: '',
};

const initialState = {
  transactions: mockTransactions,
  filters: defaultFilters,
  currentRole: 'admin',
  theme: 'light',
  activeView: 'overview',
  modal: {
    open: false,
    mode: 'add',
    instance: 0,
    form: defaultForm,
  },
};

const buildFormState = (transaction) =>
  transaction
    ? {
        id: transaction.id,
        date: transaction.date,
        amount: String(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
      }
    : {
        ...defaultForm,
        date: new Date().toISOString().slice(0, 10),
      };

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'set-role':
      return { ...state, currentRole: action.payload };
    case 'toggle-theme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'set-active-view':
      return { ...state, activeView: action.payload };
    case 'set-filter':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'open-add-modal':
      return {
        ...state,
        modal: {
          open: true,
          mode: 'add',
          instance: state.modal.instance + 1,
          form: buildFormState(),
        },
      };
    case 'open-edit-modal':
      return {
        ...state,
        modal: {
          open: true,
          mode: 'edit',
          instance: state.modal.instance + 1,
          form: buildFormState(action.payload),
        },
      };
    case 'close-modal':
      return {
        ...state,
        modal: {
          open: false,
          mode: 'add',
          instance: state.modal.instance,
          form: buildFormState(),
        },
      };
    case 'update-form':
      return {
        ...state,
        modal: {
          ...state.modal,
          form: {
            ...state.modal.form,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    case 'save-transaction': {
      const transaction = action.payload;
      const exists = state.transactions.some((item) => item.id === transaction.id);
      return {
        ...state,
        transactions: exists
          ? state.transactions.map((item) =>
              item.id === transaction.id ? transaction : item
            )
          : [transaction, ...state.transactions],
        modal: {
          open: false,
          mode: 'add',
          instance: state.modal.instance,
          form: buildFormState(),
        },
      };
    }
    case 'delete-transaction':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    financeReducer,
    initialState,
    (baseState) => {
      const persisted = loadPersistedState();
      return persisted ? { ...baseState, ...persisted } : baseState;
    }
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transactions: state.transactions,
        filters: state.filters,
        currentRole: state.currentRole,
        theme: state.theme,
        activeView: state.activeView,
      })
    );
  }, [state.transactions, state.filters, state.currentRole, state.theme, state.activeView]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const categories = useMemo(
    () => [...new Set(state.transactions.map((transaction) => transaction.category))].sort(),
    [state.transactions]
  );

  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(state.transactions, state.filters),
    [state.transactions, state.filters]
  );

  const summary = useMemo(
    () => getSummaryTotals(state.transactions),
    [state.transactions]
  );

  const trendData = useMemo(
    () => getTrendData(state.transactions),
    [state.transactions]
  );

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(state.transactions),
    [state.transactions]
  );

  const insights = useMemo(
    () => getInsights(state.transactions),
    [state.transactions]
  );

  const value = {
    ...state,
    categories,
    filteredTransactions,
    summary,
    trendData,
    categoryBreakdown,
    insights,
    setRole: (role) => dispatch({ type: 'set-role', payload: role }),
    toggleTheme: () => dispatch({ type: 'toggle-theme' }),
    setActiveView: (view) => dispatch({ type: 'set-active-view', payload: view }),
    setFilter: (key, value) =>
      dispatch({ type: 'set-filter', payload: { key, value } }),
    openAddModal: () => dispatch({ type: 'open-add-modal' }),
    openEditModal: (transaction) =>
      dispatch({ type: 'open-edit-modal', payload: transaction }),
    closeModal: () => dispatch({ type: 'close-modal' }),
    updateForm: (key, value) =>
      dispatch({ type: 'update-form', payload: { key, value } }),
    saveTransaction: () => {
      const amount = Number.parseFloat(state.modal.form.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        return { ok: false, message: 'Amount must be greater than zero.' };
      }

      const description = state.modal.form.description.trim();
      if (!description) {
        return { ok: false, message: 'Description is required.' };
      }

      const category = state.modal.form.category.trim();
      if (!category) {
        return { ok: false, message: 'Category is required.' };
      }

      const transaction = {
        id:
          state.modal.mode === 'edit' && state.modal.form.id
            ? state.modal.form.id
            : `txn-${Date.now()}`,
        date: state.modal.form.date,
        amount,
        category,
        type: state.modal.form.type,
        description,
      };

      dispatch({ type: 'save-transaction', payload: transaction });
      return { ok: true };
    },
    deleteTransaction: (id) =>
      dispatch({ type: 'delete-transaction', payload: id }),
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
