import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/50 bg-white/70 py-10 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="page-shell grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl font-bold">FreshMart</h3>
          <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-300">
            Hyperlocal grocery delivery built for fresh fruits, leafy greens, and kitchen essentials that deserve better handling.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Quick Links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/products">All Products</Link>
            <Link to="/orders">Order History</Link>
            <Link to="/profile">My Profile</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Why Customers Stay</p>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>15 minute slot-based delivery promise</p>
            <p>Transparent inventory and clean checkout flow</p>
            <p>Invoices, order SMS, and COD support built in</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

