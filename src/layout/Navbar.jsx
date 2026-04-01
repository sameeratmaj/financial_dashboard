import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, toggleDarkMode } from '../features/finance/financeSlice';
import { UserCircle, ShieldCheck, Eye, Moon, Sun } from 'lucide-react';

const Navbar = ({ activePage = 'dashboard' }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.finance.role);
  const darkMode = useSelector((state) => state.finance.darkMode);
  const pageLabel = activePage === 'transactions' ? 'Transactions' : 'Dashboard';
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const hasScrolledEnough = currentScrollY > 80;

      setIsHidden(isScrollingDown && hasScrolledEnough);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Added bg-white dark:bg-gray-800 and border-gray-200 dark:border-gray-700
    <header className={`h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Pages</span> / <span className="text-gray-900 dark:text-white font-medium">{pageLabel}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Role Switcher - Added dark:bg-gray-700 dark:border-gray-600 */}
        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 transition-colors">
          {role === 'admin' ? (
            <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
          ) : (
            <Eye size={18} className="text-orange-500 dark:text-orange-400" />
          )}
          
          <select
            value={role}
            onChange={(e) => dispatch(setRole(e.target.value))}
            // Added dark:text-white and ensured options are styled
            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer capitalize dark:text-white"
          >
            <option value="admin" className="dark:bg-gray-800">Admin Mode</option>
            <option value="viewer" className="dark:bg-gray-800">Viewer Mode</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold dark:text-white">Sameer</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
          </div>
          <UserCircle size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;