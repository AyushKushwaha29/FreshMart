import { cls } from "../../utils/formatters";

const styles = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  Accepted: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  Packed: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  "Out For Delivery": "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
  Delivered: "bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-200",
  Cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  Paid: "bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-200",
  Failed: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"
};

export default function StatusBadge({ value }) {
  return (
    <span className={cls("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[value] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200")}>
      {value}
    </span>
  );
}

