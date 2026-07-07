import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <div className="mx-auto max-w-xl rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-600">404</p>
          <h1 className="mt-3 font-display text-5xl font-bold text-slate-900 dark:text-white">Page not found</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">The page you’re looking for doesn’t exist in this FreshMart build.</p>
          <Link to="/">
            <Button className="mt-6">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

