import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
}