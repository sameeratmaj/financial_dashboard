import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', key: 'dashboard' },
    { icon: <ReceiptText size={20} />, label: 'Transactions', key: 'transactions' },
    { icon: <PieChart size={20} />, label: 'Statistics', key: 'statistics' },
    { icon: <Settings size={20} />, label: 'Settings', key: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col transition-colors duration-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          FinTrack
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item.key === 'dashboard' || item.key === 'transactions') {
                onNavigate(item.key);
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === item.key
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;