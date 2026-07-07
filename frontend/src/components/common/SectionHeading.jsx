export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}

