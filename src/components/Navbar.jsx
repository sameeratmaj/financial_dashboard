import { Eye, Plus, ShieldCheck } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Navbar() {
  const { currentRole, setRole, openAddModal } = useFinance();

  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/60 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Professional finance command center</p>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
          Financial Dashboard
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {currentRole === 'admin' ? (
            <ShieldCheck size={16} className="text-emerald-500" />
          ) : (
            <Eye size={16} className="text-amber-500" />
          )}
          <span className="font-medium">Role</span>
          <select
            value={currentRole}
            onChange={(event) => setRole(event.target.value)}
            className="bg-transparent font-semibold capitalize text-slate-900 outline-none dark:text-slate-50"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {currentRole === 'admin' ? (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        ) : (
          <div className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Read-only mode
          </div>
        )}
      </div>
    </header>
  );
}
