import { Moon, RotateCcw, Sun, Wallet } from 'lucide-react';

export default function Header({ dark, onToggleTheme, onReset }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Finans Paneli</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gelir ve giderlerine tek bakışta göz at
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title="Örnek verilere dön"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Sıfırla</span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Açık temaya geç' : 'Koyu temaya geç'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
