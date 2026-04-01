import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [
        { "id": 1, "date": "2024-03-01", "amount": 5000, "category": "Salary", "type": "income" },
        { "id": 2, "date": "2024-03-03", "amount": 1200, "category": "Freelance", "type": "income" },
        { "id": 3, "date": "2024-03-05", "amount": 45.50, "category": "Food", "type": "expense" },
        { "id": 4, "date": "2024-03-07", "amount": 120, "category": "Shopping", "type": "expense" },
        { "id": 5, "date": "2024-03-10", "amount": 60, "category": "Transport", "type": "expense" },
        { "id": 6, "date": "2024-03-12", "amount": 15, "category": "Entertainment", "type": "expense" },
        { "id": 7, "date": "2024-03-15", "amount": 200, "category": "Utilities", "type": "expense" },
        { "id": 8, "date": "2024-03-18", "amount": 85, "category": "Food", "type": "expense" },
        { "id": 9, "date": "2024-03-20", "amount": 110, "category": "Health", "type": "expense" },
        { "id": 10, "date": "2024-03-22", "amount": 40, "category": "Transport", "type": "expense" },
        { "id": 11, "date": "2024-03-25", "amount": 300, "category": "Investment", "type": "expense" },
        { "id": 12, "date": "2024-03-27", "amount": 25, "category": "Food", "type": "expense" },
        { "id": 13, "date": "2024-03-28", "amount": 50, "category": "Entertainment", "type": "expense" },
        { "id": 14, "date": "2024-03-30", "amount": 1500, "category": "Bonus", "type": "income" },
        { "id": 15, "date": "2024-03-31", "amount": 95, "category": "Shopping", "type": "expense" }
    ],
  role: 'admin', // 'admin' or 'viewer'
  darkMode: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    updateTransaction: (state, action) => {
      const { id, ...fields } = action.payload;
      const idx = state.transactions.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.transactions[idx] = { ...state.transactions[idx], ...fields };
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { addTransaction, setRole, deleteTransaction, updateTransaction, toggleDarkMode } = financeSlice.actions;
export default financeSlice.reducer;