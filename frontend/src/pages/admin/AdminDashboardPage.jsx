import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import api, { getErrorMessage } from "../../services/api";
import { currency, shortDate } from "../../utils/formatters";
import { socket } from "../../services/socket";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);

 const loadDashboard = async () => {
  try {
    const { data } = await api.get("/admin/dashboard");
    setDashboard(data.data);
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
useEffect(() => {
   loadDashboard();
}, []);

useEffect(() => {
  socket.emit("join-admin");

  const handleNewOrder = (order) => {
    toast.success(`🛒 New Order #${order.orderId}`);

    setDashboard((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        summary: {
          ...prev.summary,

          ordersCount: prev.summary.ordersCount + 1,

          pendingOrders: prev.summary.pendingOrders + 1,

          revenue:
            prev.summary.revenue + order.pricing.total,

          todayRevenue:
            prev.summary.todayRevenue + order.pricing.total,

          todayOrders:
            prev.summary.todayOrders + 1,

          averageOrderValue: Math.round(
            (prev.summary.revenue + order.pricing.total) /
              (prev.summary.ordersCount + 1)
          )
        },

        recentOrders: [
          order,
          ...prev.recentOrders.slice(0, 4)
        ]
      };
    });
  };

  socket.on("admin-order-created", handleNewOrder);

  return () => {
    socket.off("admin-order-created", handleNewOrder);
  };
}, []);


  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-brand-600">
          Admin Overview
        </p>

        <h1 className="mt-2 font-display text-4xl font-bold">
          Operations at a glance
        </h1>
      </div>

      {/* Main Summary */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          highlight
          label="Revenue"
          value={dashboard?.summary?.revenue || 0}
          currencyMode
        />

        <StatCard
          label="Orders"
          value={dashboard?.summary?.ordersCount || 0}
        />

        <StatCard
          label="Products"
          value={dashboard?.summary?.productsCount || 0}
        />

        <StatCard
          label="Customers"
          value={dashboard?.summary?.customersCount || 0}
        />

        <StatCard
          label="Coupons"
          value={dashboard?.summary?.couponsCount || 0}
        />

      </div>

      {/* New KPI Cards */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          label="Today's Revenue"
          value={dashboard?.summary?.todayRevenue || 0}
          currencyMode
        />

        <StatCard
          label="Today's Orders"
          value={dashboard?.summary?.todayOrders || 0}
        />

        <StatCard
          label="Pending Orders"
          value={dashboard?.summary?.pendingOrders || 0}
        />

        <StatCard
          label="Low Stock Products"
          value={dashboard?.summary?.lowStockProducts || 0}
        />

        <StatCard
          label="New Customers"
          value={dashboard?.summary?.newCustomers || 0}
        />

        <StatCard
          label="Average Order Value"
          value={dashboard?.summary?.averageOrderValue || 0}
          currencyMode
        />

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Low Stock */}

        <div className="glass-panel rounded-[2rem] p-6">

          <h2 className="text-2xl font-bold mb-5">
            ⚠️ Low Stock Products
          </h2>

          <div className="space-y-3">

            {dashboard?.lowStock?.length ? (

              dashboard.lowStock.map((product) => (

                <div
                  key={product._id}
                  className="flex justify-between rounded-xl border p-4"
                >

                  <span className="font-semibold">
                    {product.name}
                  </span>

                  <span className="text-red-600 font-bold">
                    {product.stock} Left
                  </span>

                </div>

              ))

            ) : (

              <p className="text-slate-500">
                No low stock products 🎉
              </p>

            )}

          </div>

        </div>

        {/* Recent Orders */}

        <div className="glass-panel rounded-[2rem] p-6">

          <h2 className="text-2xl font-bold mb-5">
            Recent Orders
          </h2>

          <div className="space-y-4">

            {dashboard?.recentOrders?.map((order) => (

              <div
                key={order._id}
                className="rounded-xl border p-4"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <p className="font-bold">
                      {order.orderId}
                    </p>

                    <p className="text-sm text-slate-500">

                      {order.user?.name} ·{" "}
                      {shortDate(order.createdAt)}

                    </p>

                  </div>

                  <div className="text-right">

                    <StatusBadge value={order.status} />

                    <p className="mt-2 font-bold">

                      {currency(order.pricing.total)}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}