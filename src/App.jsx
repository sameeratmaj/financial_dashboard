import Navbar from './components/Navbar';
import ChartContainer from './components/ChartContainer';
import InsightsPanel from './components/InsightsPanel';
import SettingsPanel from './components/SettingsPanel';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import TransactionModal from './components/TransactionModal';
import RecentTransactionsPreview from './components/RecentTransactionsPreview';
import TransactionTable from './components/TransactionTable';
import {FinanceProvider,useFinance } from './context/FinanceContext';

function DashboardShell() {
  const {activeView, currentDarkPalette, modal,theme } = useFinance();

  // The app shell owns the page-wide background so dark palette changes apply everywhere.
  const appStyle = (theme === 'dark')?
      {
        backgroundImage: 
          `radial-gradient(circle at top left, ${currentDarkPalette.softStrong}, transparent 40%),
          radial-gradient(circle at top right, ${currentDarkPalette.soft}, transparent 24%),
          linear-gradient(180deg, #020617 0%, #0f172a 100%)`
      }
      :undefined;
       

  return (
    
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,69,0,0.5),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900 transition-colors duration-300 dark:text-slate-50"
      style={appStyle}
    >


      {/* Sidebar stays stable while the main panel swaps based on activeView. */}
      <div className="mx-auto flex max-w-[1600px] items-start">
        <Sidebar />
        <main className="min-h-screen min-w-0 max-w-full flex-1 overflow-x-clip px-3 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-3 sm:px-5 sm:pt-4 md:px-6 lg:px-8 lg:pb-8 lg:pt-6">
          <Navbar />
          
          <div className="grid gap-3 sm:gap-4 md:gap-5">
            
            {/* activeView acts like a lightweight in-app router for the dashboard sections. */}

            {
              (activeView === 'overview') ? (
                <>
                  <SummaryCards />

                  <section className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
                    <ChartContainer />
                  </section>

                  <InsightsPanel />
                  <RecentTransactionsPreview />
                </>
              ) : null
            }

            {activeView === 'transactions' ? <TransactionTable /> : null}
            {activeView === 'insights' ? <InsightsPanel /> : null}
            {activeView === 'settings' ? <SettingsPanel /> : null}
          </div>
        </main>
      </div>

      <TransactionModal key={modal.instance} />
    </div>
  );
}

export default function App() {
  return (
    // Provide one shared state container to the entire dashboard tree.
    <FinanceProvider>
      <DashboardShell />
    </FinanceProvider>
  );
}
