import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import Dashboard from './views/Dashboard';
import TransactionsPage from './views/TransactionsPage';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const darkMode = useSelector((state) => state.finance.darkMode);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex-1 flex flex-col">
          <Navbar activePage={activePage} />
          <main className="p-4 md:p-8">
            {activePage === 'transactions' ? (
              <TransactionsPage />
            ) : (
              <Dashboard onViewAllTransactions={() => setActivePage('transactions')} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;