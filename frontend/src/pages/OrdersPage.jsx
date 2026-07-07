import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";
import api, { getErrorMessage } from "../services/api";
import { currency, shortDate } from "../utils/formatters";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/orders");
        setOrders(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (!loading && !orders.length) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState description="Your completed orders will appear here with invoice links and payment details." title="No orders yet" />
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="page-shell space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-brand-600">Order history</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">Everything you’ve ordered</h1>
        </div>
        <div className="space-y-4">
          {orders.map((order) => (
            <div className="glass-panel rounded-[2rem] p-5" key={order._id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{order.orderId}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {shortDate(order.createdAt)} · {order.items.length} items · {currency(order.pricing.total)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={order.status} />
                  <StatusBadge value={order.paymentStatus} />
                  {order.invoiceUrl && (
                    <a className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700" href={order.invoiceUrl} rel="noreferrer" target="_blank">
                      Invoice
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {order.items.map((item) => (
                  <div className="rounded-3xl bg-white/70 p-4 dark:bg-slate-900/60" key={`${order._id}-${item.name}`}>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Qty {item.quantity} · {item.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

