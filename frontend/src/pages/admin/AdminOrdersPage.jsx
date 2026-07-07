import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import api, { getErrorMessage } from "../../services/api";
import { currency, shortDate } from "../../utils/formatters";

const statuses = ["Pending", "Accepted", "Packed", "Out For Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async () => {
    try {
      const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const { data } = await api.get(`/admin/orders${query}`);
      setOrders(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, {
        status,
        note: `Updated to ${status} from admin panel`
      });
      toast.success("Order status updated");
      await loadOrders();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const exportOrders = async () => {
    try {
      const response = await api.get("/admin/orders/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "freshmart-orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Order management</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track live orders, update fulfillment status, and export operations data.</p>
        </div>
        <div className="flex gap-3">
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button onClick={exportOrders} variant="secondary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div className="glass-panel rounded-[2rem] p-5" key={order._id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{order.orderId}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {order.user?.name} · {order.user?.mobile} · {shortDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge value={order.status} />
                <StatusBadge value={order.paymentStatus} />
                <span className="font-semibold text-slate-900 dark:text-white">{currency(order.pricing.total)}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {statuses.map((status) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${order.status === status ? "bg-brand-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
                  key={`${order._id}-${status}`}
                  onClick={() => updateStatus(order._id, status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

