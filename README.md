# Zorvyn Financial Dashboard

A responsive fintech-style dashboard for tracking income, expenses, balance trends, and transaction insights.

[Live Demo](https://financialdashboard-ten.vercel.app)

## Overview

Zorvyn Financial Dashboard is a modern React + Vite project designed to feel like a practical personal finance product rather than a static assignment UI. It combines clean analytics, role-based interaction, responsive layouts, dynamic dark-mode palettes, and transaction-driven insights in a single dashboard experience.

The project is built to be:

- visually polished
- mobile friendly
- easy to explore
- simple to extend

## Key Features

- Responsive application shell with desktop sidebar and mobile bottom navigation
- Overview dashboard with balance, income, and expense summary cards
- Interactive balance trend chart with daily, weekly, monthly, and yearly views
- Spending-by-category visualization using Recharts
- Auto-sliding insights panel with manual drag and swipe support
- Full transaction management flow for add, edit, delete, filter, sort, and export
- Role-based experience with `Admin` and `Viewer` modes
- Theme switching with dark-mode palette customization
- Local persistence using `localStorage`
- 24-hour inactivity expiry for persisted dashboard state
- Export filtered transactions as CSV or JSON

## Tech Stack

| Category | Tools |
| --- | --- |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| State Management | React Context API + `useReducer` |
| Persistence | Browser `localStorage` |
| Deployment | Vercel |

## User Experience Highlights

### Dashboard Views

- `Overview` for quick financial snapshots
- `Transactions` for detailed record management
- `Insights` for transaction-based observations
- `Settings` for role, theme, and dark palette controls

### Theme System

- Light mode uses a fresh green accent style
- Dark mode supports switchable accent palettes
- Palette selection updates major dark-mode surfaces like buttons, charts, highlights, and navigation

### Insights Engine

Insights are generated from transaction data instead of static placeholder copy. The dashboard currently surfaces:

- highest spending category
- monthly comparison
- savings observation
- largest expense
- spending pace
- highest income entry

## Project Structure

```text
src/
  assets/
  components/
    ChartContainer.jsx
    InsightsPanel.jsx
    Navbar.jsx
    RecentTransactionsPreview.jsx
    SettingsPanel.jsx
    Sidebar.jsx
    SummaryCards.jsx
    TransactionModal.jsx
    TransactionTable.jsx
  context/
    FinanceContext.jsx
  data/
    mockTransactions.js
  hooks/
    useMediaQuery.js
  utils/
    finance.js
    theme.js
  App.jsx
  index.css
  main.jsx
```

## How It Works

### Global State

The app uses a centralized `FinanceProvider` powered by `useReducer` to manage:

- transactions
- filters
- current role
- theme
- dark palette
- trend range
- active view
- modal state

### Derived Analytics

The provider computes reusable derived values such as:

- summary totals
- trend chart data
- category breakdown
- filtered transactions
- recent transactions
- insights

This keeps the components focused on presentation while business logic stays in utility and context layers.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build locally

```bash
npm run preview
```

## Demo Flow

If you want to quickly explore the app, try this order:

1. Open the overview dashboard
2. Switch between light and dark mode in Settings
3. Change the dark palette and watch the UI update
4. Try the trend range selector on the balance chart
5. Open Transactions and test search, filters, and export
6. Switch between `Admin` and `Viewer` to see access differences
7. Open the Insights section and drag the carousel manually

## Persistence Behavior

The dashboard stores user state in `localStorage` under the key `zorvyn-finance-dashboard`.

Persisted data includes:

- transactions
- filters
- role
- theme
- dark palette
- active view
- trend range

To avoid stale local state, saved data expires after 24 hours of inactivity.

## Why This Project Stands Out

- Strong product-like UI instead of a plain CRUD assignment
- Clear state architecture with Context + reducer
- Reusable utility-driven analytics
- Responsive behavior tailored for desktop, tablet, and mobile usage
- Personalized dark-mode styling through palette selection

## Future Improvements

- recurring transaction detection
- anomaly alerts for unusual spending spikes
- budgets by category
- authentication and real backend integration
- downloadable reports and PDF summaries

## Author

Built by Sameer for the Zorvyn financial dashboard project.
