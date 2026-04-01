# Zorvyn Finance Dashboard

A modular React + Vite finance dashboard built for the Zorvyn internship assignment. The UI is designed to feel like a modern fintech product, with a responsive layout, strong visual hierarchy, local persistence, role-based controls, and calculated insights generated from transaction data.

## Highlights

- Bento-style dashboard layout with responsive desktop and mobile navigation
- Summary cards for total balance, income, and expenses
- Recharts `AreaChart` for balance trend and `PieChart` for category breakdown
- Search, filter, and sort controls for transaction management
- Role switcher with `Admin` and `Viewer` modes
- Add, edit, and delete transaction flows for admins
- Read-only transaction experience for viewers
- Local persistence with `localStorage`
- Export current transaction view as CSV or JSON
- Light and dark theme support
- 29 seeded mock transactions for realistic initial state

## Tech Stack

- React with Vite
- Tailwind CSS
- Lucide React
- Recharts
- React Context API with `useReducer`

## Project Structure

```text
src/
  components/
    ChartContainer.jsx
    InsightsPanel.jsx
    Navbar.jsx
    Sidebar.jsx
    SummaryCards.jsx
    TransactionModal.jsx
    TransactionTable.jsx
  context/
    FinanceContext.jsx
  data/
    mockTransactions.js
  utils/
    finance.js
  App.jsx
  index.css
  main.jsx
```

## State Management Approach

The dashboard uses a centralized React Context provider backed by `useReducer`.

It manages:

- `transactions`: full transaction dataset, including user-created edits
- `filters`: search, category, type, and sort configuration
- `currentRole`: `admin` or `viewer`
- `theme`: `light` or `dark`
- `activeView`: overview, transactions, or insights
- `modal`: add/edit modal state and current form values

Derived dashboard data is computed with memoized selectors inside the provider:

- summary totals
- balance trend data
- spending by category
- filtered and sorted transaction list
- insights such as highest spending category, monthly comparison, and savings observation

## Role Switching

Use the role switcher in the top navigation to change between:

- `Admin`: can add, edit, delete, export, and manage transactions
- `Viewer`: sees a read-only dashboard with hidden management actions

This makes the RBAC behavior easy to demo during review.

## Persistence

The dashboard stores the following values in `localStorage` under `zorvyn-finance-dashboard`:

- transactions
- filters
- current role
- current theme
- active view

Any added or edited transactions persist after a page refresh.

## Insights Logic

The insights section is calculated from live transaction data instead of using static placeholder text.

- Highest Spending Category: computed from expense totals grouped by category
- Monthly Comparison: compares the most recent month of expenses against the previous month
- Useful Observation: calculates the current month's savings rate from income vs expenses

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## Demo Notes

- The dashboard starts in `Admin` mode.
- Use `Add Transaction` to create a record.
- Use the edit and delete actions in the transaction table to manage entries.
- Switch to `Viewer` mode to verify the read-only experience.
- Use the export buttons to download the currently filtered transaction set.

## Technical Decisions

- React Context API was chosen to satisfy the assignment requirement without introducing extra complexity.
- The reducer keeps transaction logic predictable and easier to document.
- Derived calculations live in utility functions to keep components presentational and modular.
- `localStorage` persistence improves the demo experience and shows real product thinking.
- The mobile layout uses a bottom navigation pattern instead of a full sidebar to keep the interface touch-friendly.
