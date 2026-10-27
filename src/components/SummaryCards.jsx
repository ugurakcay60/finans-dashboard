import { ArrowDownRight, ArrowUpRight, Landmark } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import GlowCard from './ui/GlowCard';

function Card({ title, value, icon: Icon, accent, hint }) {
  return (
    <GlowCard as="div" className="overflow-hidden p-5">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 ${accent.blob}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${accent.text}`}>
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </GlowCard>
  );
}

export default function SummaryCards({ income, expense, count }) {
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        title="Toplam Bakiye"
        value={formatCurrency(balance)}
        icon={Landmark}
        hint={`Tasarruf oranı: %${savingsRate}`}
        accent={{
          text: balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500',
          icon: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
          blob: 'bg-indigo-500',
        }}
      />
      <Card
        title="Toplam Gelir"
        value={formatCurrency(income)}
        icon={ArrowUpRight}
        hint={`${count.income} gelir işlemi`}
        accent={{
          text: 'text-emerald-600 dark:text-emerald-400',
          icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          blob: 'bg-emerald-500',
        }}
      />
      <Card
        title="Toplam Gider"
        value={formatCurrency(expense)}
        icon={ArrowDownRight}
        hint={`${count.expense} gider işlemi`}
        accent={{
          text: 'text-rose-600 dark:text-rose-400',
          icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
          blob: 'bg-rose-500',
        }}
      />
    </section>
  );
}
