import { useState } from 'react';
import { Plus } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import GlowCard from './ui/GlowCard';

const emptyForm = { type: 'expense', amount: '', category: EXPENSE_CATEGORIES[0], description: '' };

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-indigo-400';

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const setType = (type) =>
    setForm((f) => ({
      ...f,
      type,
      category: (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)[0],
    }));

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(String(form.amount).replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Lütfen 0’dan büyük geçerli bir miktar girin.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onAdd({
        type: form.type,
        category: form.category,
        amount,
        description: form.description.trim() || form.category,
        date: new Date().toISOString(),
      });
      setForm({ ...emptyForm, type: form.type, category: categories[0] });
    } catch (err) {
      setError(err.message || 'İşlem eklenemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlowCard className="p-5">
      <h2 className="text-base font-semibold">Yeni İşlem Ekle</h2>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Gelir veya giderini kaydet</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { value: 'expense', label: 'Gider', active: 'bg-rose-500 text-white shadow' },
            { value: 'income', label: 'Gelir', active: 'bg-emerald-500 text-white shadow' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`rounded-md py-2 text-sm font-medium transition ${
                form.type === opt.value
                  ? opt.active
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Miktar (TL)
            </span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={update('amount')}
              className={`${inputClass} tabular-nums`}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Kategori
            </span>
            <select value={form.category} onChange={update('category')} className={inputClass}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Açıklama
          </span>
          <input
            type="text"
            placeholder="Örn. Haftalık market"
            maxLength={80}
            value={form.description}
            onChange={update('description')}
            className={inputClass}
          />
        </label>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {submitting ? 'Ekleniyor…' : 'İşlemi Ekle'}
        </button>
      </form>
    </GlowCard>
  );
}
