import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../services/api";
import StatusBadge from "../components/ui/StatusBadge";
import { currency, shortDate } from "../utils/formatters";
import { socket } from "../services/socket";

const steps = [
  "Pending",
  "Accepted",
  "Packed",
  "Out For Delivery",
  "Delivered"
];
const stepIcons = {
  Pending: "🛒",
  Accepted: "✅",
  Packed: "📦",
  "Out For Delivery": "🚚",
  Delivered: "🎉"
};
export default function TrackOrderPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadOrder();
  }, [id]);

useEffect(() => {
  if (!order) return;

  console.log("Order Loaded:", order);
  console.log("Joining User Room:", order.user?._id || order.user);

  socket.emit("join-user", order.user?._id || order.user);

  const handleStatusUpdate = (data) => {
    console.log("📢 Socket Event Received:", data);

    if (data.orderId !== order.orderId) return;

    setOrder((prev) => ({
      ...prev,
      status: data.status,
      paymentStatus: data.paymentStatus,
    }));

    toast.success(`🎉 Order ${data.status}`);
  };

  socket.on("order-status-updated", handleStatusUpdate);

  return () => {
    socket.off("order-status-updated", handleStatusUpdate);
  };
}, [order]);

  if (!order) {
    return (
      <div className="section-space">
        <div className="page-shell">
          Loading...
        </div>
      </div>
    );
  }

const currentStep = Math.max(
  steps.indexOf(order.status),
  0
);

const progress =
  ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="section-space">
      <div className="page-shell max-w-4xl">

        <div className="glass-panel rounded-[2rem] p-8">

          <h1 className="text-4xl font-display font-bold">
            Track Order
          </h1>

          <p className="mt-2 text-slate-500">
            {order.orderId}
          </p>

          <div className="mt-6 flex gap-3">
            <StatusBadge value={order.status} />
            <StatusBadge value={order.paymentStatus} />
          </div>
           
<div className="mt-8">

  <div className="flex justify-between mb-2">

    <span className="font-semibold">
      Order Progress
    </span>

    <span className="font-bold text-green-600">
      {Math.round(progress)}%
    </span>

  </div>

  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

    <div
      className="h-full rounded-full bg-green-600 transition-all duration-1000 ease-in-out"
      style={{
        width: `${progress}%`
      }}
    />

  </div>

</div>

     <div className="mt-10">

  {/* Progress Bar */}

  <div className="mb-10">

    <div className="flex justify-between">

      {steps.map((step, index) => (

        <div
          key={step}
          className="flex flex-col items-center flex-1 relative"
        >

          {/* Circle */}

          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl transition-all duration-500
            ${
              index <= currentStep
                ? "bg-green-600 text-white shadow-lg scale-110"
                : "bg-slate-200"
            }`}
          >
            {stepIcons[step]}
          </div>

          {/* Line */}

          {index !== steps.length - 1 && (

            <div
              className={`absolute top-7 left-1/2 w-full h-1
              ${
                index < currentStep
                  ? "bg-green-600"
                  : "bg-slate-300"
              }`}
            />

          )}

          <p className="mt-3 text-sm font-semibold text-center">
            {step}
          </p>

        </div>

      ))}

    </div>

  </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <h2 className="text-xl font-bold">
                Delivery Address
              </h2>

              <p className="mt-3">
                {order.deliveryAddress.fullName}
              </p>

              <p>
                {order.deliveryAddress.mobile}
              </p>

              <p>
                {order.deliveryAddress.line1}
              </p>

              <p>
                {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.state}
              </p>

              <p>
                {order.deliveryAddress.postalCode}
              </p>

            </div>

            <div>

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <p className="mt-3">
                Order Date :
                {" "}
                {shortDate(order.createdAt)}
              </p>

              <p>
                Payment :
                {" "}
                {order.paymentMethod}
              </p>

              <p>
                Total :
                {" "}
                {currency(order.pricing.total)}
              </p>

              <p>
                Estimated Delivery :
                {" "}
                {shortDate(order.estimatedDeliveryAt)}
              </p>

            </div>

          </div>

        </div>
</div>
      </div>
    </div>
  );
}