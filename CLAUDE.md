# CLAUDE.md

Personal finance dashboard ("Finans Paneli"). Vite 6 + React 18 (plain JSX, no TypeScript) + Tailwind v4 + Recharts + lucide-react + motion. UI text and code comments are Turkish. `../claude panel.md` is the original brief.

- **Deploy:** public GitHub repo `ugurakcay60/finans-dashboard`; every push to `main` deploys to Vercel (project `finans-dashboard`) → https://finans-dashboard-pi.vercel.app. Custom domain `finans.ugur-labs.com` is attached and goes live once its CNAME exists at turkticaret.net. Listed on ugur-labs.com via `ugur-labs.com/src/data/projects.ts`. Public repo: never commit real financial data or `.env`.
- Commands: `npm run dev` (http://localhost:5173, opens the browser), `npm run build` (output in `dist/`), `npm run preview`. No tests or linter.
- **Data layer:** `src/services/transactionService.js` picks an adapter at load time — localStorage (key `finans-dashboard:transactions`, seeded from `src/data/initialTransactions.js`) by default, or a REST/MCP bridge when `VITE_API_URL` is set in `.env` (see `.env.example`; endpoints `GET/POST /transactions`, `DELETE /transactions/:id`). Both adapters share `list/add/remove/reset`; the remote one has `reset: null`, which hides the "Sıfırla" button. Components never touch storage directly — go through the service.
- Transaction shape: `{ id, type: 'income' | 'expense', category, amount, description, date }`. Categories live in `src/data/categories.js`; TL/date formatting in `src/utils/format.js`.
- State lives in `App.jsx` (transactions, totals, theme); components under `src/components/` are presentational.
- **Theme:** `.dark` on `<html>`, set before first paint by the inline script in `index.html` (localStorage `theme`, else system) and toggled by `useTheme` in `App.jsx`. Tailwind's `dark:` variant is bound to that class via `@custom-variant` in `src/index.css`.
- Cards use `src/components/ui/GlowCard.jsx` (wraps `glowing-effect.jsx`, mouse-following border); `cn()` in `src/lib/utils.js` = clsx + tailwind-merge. `@` aliases `src/`.
