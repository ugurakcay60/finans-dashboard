import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import ExpenseChart from './components/ExpenseChart';
import TransactionList from './components/TransactionList';
import { transactionService } from './services/transactionService';

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // tercih kaydedilemezse sorun değil
    }
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}

export default function App() {
  const [dark, toggleTheme] = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    transactionService
      .list()
      .then(setTransactions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addTransaction = useCallback(
    async (tx) => {
      const created = await transactionService.add(tx, transactions);
      setTransactions((prev) => [created, ...prev]);
    },
    [transactions]
  );

  const removeTransaction = useCallback(
    async (id) => {
      try {
        await transactionService.remove(id, transactions);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError(err.message);
      }
    },
    [transactions]
  );

  const resetTransactions = useCallback(async () => {
    setTransactions(await transactionService.reset());
  }, []);

  const totals = useMemo(() => {
    const sum = { income: 0, expense: 0, count: { income: 0, expense: 0 } };
    for (const t of transactions) {
      sum[t.type] += t.amount;
      sum.count[t.type] += 1;
    }
    return sum;
  }, [transactions]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Header
        dark={dark}
        onToggleTheme={toggleTheme}
        onReset={transactionService.reset ? resetTransactions : null}
      />

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <>
          <SummaryCards income={totals.income} expense={totals.expense} count={totals.count} />

          <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <TransactionForm onAdd={addTransaction} />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <ExpenseChart transactions={transactions} />
              <TransactionList transactions={transactions} onRemove={removeTransaction} />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
