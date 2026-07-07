export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="shimmer h-48 rounded-3xl" />
      <div className="mt-4 shimmer h-4 rounded-full" />
      <div className="mt-3 shimmer h-4 w-2/3 rounded-full" />
      <div className="mt-5 shimmer h-10 rounded-2xl" />
    </div>
  );
}

