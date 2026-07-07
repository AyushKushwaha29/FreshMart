import { BarChart3, LayoutDashboard, Package, PercentSquare, ShoppingBag, Tags, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: PercentSquare },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="page-shell grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel rounded-4xl p-5">
          <Link className="font-display text-2xl font-bold text-brand-700 dark:text-brand-300" to="/">
            FreshMart Admin
          </Link>
          <div className="mt-6 space-y-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`
                  }
                  to={item.to}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </aside>
        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
