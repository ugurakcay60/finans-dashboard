import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/categories';
import { formatCurrency } from '../utils/format';
import GlowCard from './ui/GlowCard';

const renderActiveShape = (props) => (
  <Sector {...props} outerRadius={props.outerRadius + 8} cornerRadius={6} />
);

function ChartTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium">{name}</p>
      <p className="tabular-nums text-slate-500 dark:text-slate-400">
        {formatCurrency(value)} · %{((value / total) * 100).toFixed(1)}
      </p>
    </div>
  );
}

export default function ExpenseChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = useMemo(() => {
    const totals = {};
    for (const t of transactions) {
      if (t.type === 'expense') totals[t.category] = (totals[t.category] ?? 0) + t.amount;
    }
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const active = data[activeIndex];

  return (
    <GlowCard className="p-5">
      <h2 className="text-base font-semibold">Gider Dağılımı</h2>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Kategorilere göre harcamalar</p>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
          <PieIcon className="h-8 w-8" />
          <p className="text-sm">Henüz gider yok</p>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="85%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  isAnimationActive
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={CATEGORY_COLORS[d.name] ?? '#64748b'} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {active ? active.name : 'Toplam Gider'}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {formatCurrency(active ? active.value : total)}
              </span>
            </div>
          </div>

          <ul className="space-y-2">
            {data.map((d, i) => (
              <li
                key={d.name}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(-1)}
                className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-sm transition ${
                  activeIndex === i ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[d.name] ?? '#64748b' }}
                  />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                  %{((d.value / total) * 100).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlowCard>
  );
}
