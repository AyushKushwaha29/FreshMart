import { currency } from "../../utils/formatters";

export default function StatCard({ label, value, highlight = false, currencyMode = false }) {
  return (
    <div className={`rounded-4xl border p-5 shadow-soft ${highlight ? "border-brand-200 bg-brand-600 text-white" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
      <p className={`text-sm ${highlight ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{label}</p>
      <p className={`mt-3 font-display text-3xl font-bold ${highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {currencyMode ? currency(value) : value}
      </p>
    </div>
  );
}

