import { cls } from "../../utils/formatters";

export default function Input({ label, className, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <input
        className={cls(
          "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900",
          className
        )}
        {...props}
      />
    </label>
  );
}

