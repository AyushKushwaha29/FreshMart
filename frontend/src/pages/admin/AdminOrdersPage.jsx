import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import api, { getErrorMessage } from "../../services/api";
import { currency, shortDate } from "../../utils/formatters";
import Modal from "../../components/ui/Modal";
import { socket } from "../../services/socket";

const statuses = [
  "Pending",
  "Accepted",
  "Packed",
  "Out For Delivery",
  "Delivered",
  "Cancelled"
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const loadOrders = async () => {
    try {
      const query = statusFilter
        ? `?status=${encodeURIComponent(statusFilter)}`
        : "";

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



useEffect(() => {
  socket.emit("join-admin");

  // New Order
  const handleNewOrder = (order) => {
    toast.success(`🛒 ${order.orderId} Received`);

    setOrders((prev) => [order, ...prev]);
  };

  // Status Changed
  const handleStatusUpdate = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );

    toast.success(
      `📦 ${updatedOrder.orderId} → ${updatedOrder.status}`
    );
  };

  socket.on("admin-order-created", handleNewOrder);

  socket.on(
    "admin-order-status-changed",
    handleStatusUpdate
  );

  return () => {
    socket.off(
      "admin-order-created",
      handleNewOrder
    );

    socket.off(
      "admin-order-status-changed",
      handleStatusUpdate
    );
  };
}, []);



  const exportOrders = async () => {
    try {
      const response = await api.get("/admin/orders/export", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = "freshmart-orders.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const value = search.toLowerCase();

    return (
      order.orderId?.toLowerCase().includes(value) ||
      order.user?.name?.toLowerCase().includes(value) ||
      order.user?.mobile?.includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            Order Management
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Track live orders, update order status and export data.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search Order ID, Customer or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 w-full md:w-80 dark:bg-slate-900 dark:border-slate-700"
          />

          <select
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:bg-slate-900 dark:border-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>

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

      {filteredOrders.length === 0 && (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Orders Found
          </h2>

          <p className="mt-2 text-slate-500">
            Try another search or status filter.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="glass-panel rounded-[2rem] p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {order.orderId}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {order.user?.name} • {order.user?.mobile}
                </p>

                <p className="text-sm text-slate-500">
                  {order.user?.email}
                </p>

                <p className="text-sm text-slate-500">
                  {shortDate(order.createdAt)}
                </p>

                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-500">
                    Items : {order.items?.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    Payment : {order.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge value={order.status} />

                <StatusBadge value={order.paymentStatus} />

                <span className="font-bold text-lg">
                  {currency(order.pricing.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={`${order._id}-${status}`}
                  type="button"
                  onClick={() => updateStatus(order._id, status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    order.status === status
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-slate-100 hover:bg-green-100 dark:bg-slate-900 dark:hover:bg-green-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            <Button
             variant="secondary"
             onClick={() => {
             setSelectedOrder(order);
             setOpen(true);
              }}
              >
             View Details
             </Button>
            </div>
          </div>
        ))}
      </div>
    
    
    <Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Order Details"
>
  {selectedOrder && (
    <div className="space-y-6">

      <div>
        <h3 className="text-xl font-bold">
          Customer
        </h3>

        <p>{selectedOrder.user?.name}</p>
        <p>{selectedOrder.user?.mobile}</p>
        <p>{selectedOrder.user?.email}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold">
          Payment
        </h3>

        <p>Method : {selectedOrder.paymentMethod}</p>
        <p>Status : {selectedOrder.paymentStatus}</p>
        <p>Total : {currency(selectedOrder.pricing.total)}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold">
          Products
        </h3>

        <div className="space-y-3">
          {selectedOrder.items?.map((item) => (
            <div
              key={item.product || item.name}
              className="flex justify-between border rounded-xl p-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>
                  Qty : {item.quantity}
                </p>
              </div>

              <div>
                {currency(item.subtotal)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold">
          Delivery Address
        </h3>

        <p>{selectedOrder.deliveryAddress?.fullName}</p>
        <p>{selectedOrder.deliveryAddress?.mobile}</p>
        <p>{selectedOrder.deliveryAddress?.line1}</p>
        <p>{selectedOrder.deliveryAddress?.city}</p>
        <p>{selectedOrder.deliveryAddress?.state}</p>
        <p>{selectedOrder.deliveryAddress?.postalCode}</p>
      </div>

    </div>
  )}
</Modal>
</div>
  );
}