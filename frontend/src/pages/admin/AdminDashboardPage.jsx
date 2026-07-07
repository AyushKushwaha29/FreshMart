import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import api, { getErrorMessage } from "../../services/api";
import { currency, shortDate } from "../../utils/formatters";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setDashboard(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-brand-600">Admin overview</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">Operations at a glance</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard highlight label="Revenue" value={dashboard?.summary?.revenue || 0} currencyMode />
        <StatCard label="Orders" value={dashboard?.summary?.ordersCount || 0} />
        <StatCard label="Products" value={dashboard?.summary?.productsCount || 0} />
        <StatCard label="Customers" value={dashboard?.summary?.customersCount || 0} />
        <StatCard label="Coupons" value={dashboard?.summary?.couponsCount || 0} />
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Recent orders</h2>
        <div className="mt-5 space-y-4">
          {dashboard?.recentOrders?.map((order) => (
            <div className="rounded-4xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={order._id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{order.orderId}</p>
                  <p className="mt-1 text-sm text-slate-500">{order.user?.name} · {shortDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={order.status} />
                  <span className="font-semibold text-slate-900 dark:text-white">{currency(order.pricing.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

