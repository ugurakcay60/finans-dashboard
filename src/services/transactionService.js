/**
 * İşlem servis katmanı.
 *
 * Varsayılan olarak veriler tarayıcının localStorage'ında tutulur.
 * .env dosyasında VITE_API_URL tanımlanırsa aynı arayüz bir REST/MCP
 * köprüsüne bağlanır. Beklenen uç noktalar:
 *   GET    {VITE_API_URL}/transactions        -> Transaction[]
 *   POST   {VITE_API_URL}/transactions        -> Transaction (oluşturulan)
 *   DELETE {VITE_API_URL}/transactions/:id    -> 204
 *
 * Transaction: { id, type: 'income' | 'expense', category, amount, description, date }
 */
import { initialTransactions } from '../data/initialTransactions';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const STORAGE_KEY = 'finans-dashboard:transactions';

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const localAdapter = {
  source: 'local',

  async list() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // localStorage erişilemezse örnek verilerle devam et
    }
    return [...initialTransactions];
  },

  async save(transactions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // Gizli sekme vb. durumlarda kalıcılık olmadan çalışmaya devam et
    }
  },

  async add(transaction, current) {
    const created = { ...transaction, id: newId() };
    await this.save([created, ...current]);
    return created;
  },

  async remove(id, current) {
    await this.save(current.filter((t) => t.id !== id));
  },

  async reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // yok say
    }
    return [...initialTransactions];
  },
};

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API hatası: ${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}

const remoteAdapter = {
  source: 'remote',
  list: () => request('/transactions'),
  add: (transaction) =>
    request('/transactions', { method: 'POST', body: JSON.stringify(transaction) }),
  remove: (id) => request(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reset: null,
};

export const transactionService = API_URL ? remoteAdapter : localAdapter;
