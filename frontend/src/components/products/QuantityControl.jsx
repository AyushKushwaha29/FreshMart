import { Minus, Plus } from "lucide-react";

export default function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-brand-50 px-3 py-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
      <button className="rounded-full p-1 hover:bg-white/80 dark:hover:bg-slate-800" onClick={onDecrease} type="button">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
      <button className="rounded-full p-1 hover:bg-white/80 dark:hover:bg-slate-800" onClick={onIncrease} type="button">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

