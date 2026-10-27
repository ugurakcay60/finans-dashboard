import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Inbox, Trash2 } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/format';
import GlowCard from './ui/GlowCard';

const FILTERS = [
  { value: 'all', label: 'Tümü' },
  { value: 'income', label: 'Gelir' },
  { value: 'expense', label: 'Gider' },
];

export default function TransactionList({ transactions, onRemove }) {
  const [filter, setFilter] = useState('all');

  const rows = useMemo(
    () =>
      transactions
        .filter((t) => filter === 'all' || t.type === filter)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, filter]
  );

  return (
    <GlowCard className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
        <div>
          <h2 className="text-base font-semibold">Son İşlemler</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{rows.length} kayıt</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                filter === f.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-thin max-h-[26rem] overflow-y-auto px-2 pb-2">
        {rows.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">Gösterilecek işlem yok</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((t) => {
              const income = t.type === 'income';
              const Icon = income ? ArrowUpRight : ArrowDownRight;
              return (
                <li
                  key={t.id}
                  className="group flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      income
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
                        {t.category}
                      </span>
                      <span className="ml-2">{formatDateTime(t.date)}</span>
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      income ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {income ? '+' : '−'}
                    {formatCurrency(t.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(t.id)}
                    aria-label="İşlemi sil"
                    className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </GlowCard>
  );
}
