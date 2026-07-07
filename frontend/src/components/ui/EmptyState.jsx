import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass-panel rounded-4xl p-8 text-center">
      <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

