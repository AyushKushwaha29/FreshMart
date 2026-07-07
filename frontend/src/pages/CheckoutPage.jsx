import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";
import api, { getErrorMessage } from "../services/api";
import { currency } from "../utils/formatters";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const defaultAddress = {
  fullName: "",
  mobile: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  tag: "Home",
  isDefault: false
};

export default function CheckoutPage() {
  const { cart, pricing, refreshCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressForm, setAddressForm] = useState(defaultAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const loadAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data.data);
      const defaultItem = data.data.find((item) => item.isDefault);
      setSelectedAddress(defaultItem?._id || data.data[0]?._id || "");
      if (!data.data.length) {
        setShowAddressForm(true);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    try {
      await api.post("/addresses", addressForm);
      toast.success("Address added successfully");
      setAddressForm(defaultAddress);
      setShowAddressForm(false);
      await loadAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCodOrder = async () => {
    const { data } = await api.post("/orders/cod", {
      addressId: selectedAddress
    });
    await refreshCart();
    navigate(`/order-success?orderId=${data.data.orderId}`);
  };

  const handleRazorpayOrder = async () => {
    const [{ data }, scriptLoaded] = await Promise.all([
      api.post("/payments/razorpay/order", { addressId: selectedAddress }),
      loadRazorpayScript()
    ]);

    const finishVerification = async (payload) => {
      const response = await api.post("/payments/razorpay/verify", payload);
      await refreshCart();
      navigate(`/order-success?orderId=${response.data.data.orderId}`);
    };

    if (!scriptLoaded || !window.Razorpay || data.data.key === "rzp_test_mock") {
      await finishVerification({
        razorpayOrderId: data.data.orderId,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: "mock_signature"
      });
      return;
    }

    const options = {
      key: data.data.key,
      amount: data.data.amount,
      currency: data.data.currency,
      name: "FreshMart",
      description: "FreshMart Grocery Checkout",
      order_id: data.data.orderId,
      handler: async (response) => {
        await finishVerification({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });
      },
      theme: {
        color: "#15803d"
      }
    };

    const razorpayCheckout = new window.Razorpay(options);
    razorpayCheckout.open();
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select or add an address");
      return;
    }

    setPlacingOrder(true);
    try {
      if (paymentMethod === "COD") {
        await handleCodOrder();
      } else {
        await handleRazorpayOrder();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart.items?.length) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState
            actionLabel="Go to products"
            description="Your cart is empty, so checkout has nothing to process right now."
            onAction={() => navigate("/products")}
            title="Nothing to checkout"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose an address and payment mode to complete your order.</p>
              </div>
              <Button onClick={() => setShowAddressForm((current) => !current)} variant="secondary">
                {showAddressForm ? "Hide form" : "Add address"}
              </Button>
            </div>

            {showAddressForm && (
              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={saveAddress}>
                {Object.entries(addressForm).map(([key, value]) => {
                  if (["country", "tag", "isDefault"].includes(key)) {
                    return null;
                  }

                  return (
                    <Input
                      key={key}
                      label={key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
                      onChange={(event) => setAddressForm((current) => ({ ...current, [key]: event.target.value }))}
                      value={value}
                    />
                  );
                })}
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    checked={addressForm.isDefault}
                    onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))}
                    type="checkbox"
                  />
                  Make default
                </label>
                <Button className="md:col-span-2" type="submit">
                  Save address
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-4">
              {addresses.map((address) => (
                <button
                  className={`w-full rounded-4xl border p-4 text-left transition ${selectedAddress === address._id ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}
                  key={address._id}
                  onClick={() => setSelectedAddress(address._id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{address.fullName} · {address.tag}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {address.line1}, {address.city}, {address.state} - {address.postalCode}
                      </p>
                    </div>
                    {address.isDefault && <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Default</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Payment method</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {["COD", "Razorpay"].map((method) => (
                <button
                  className={`rounded-4xl border p-5 text-left ${paymentMethod === method ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  type="button"
                >
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{method === "COD" ? "Cash on Delivery" : "Pay with Razorpay"}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {method === "COD"
                      ? "Collect payment at delivery time while still receiving invoice and SMS confirmation."
                      : "Use Razorpay checkout for cards, UPI, and wallets with verification on the backend."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Review order</h2>
          <div className="mt-5 space-y-4">
            {cart.items.map((item) => (
              <div className="flex items-center justify-between gap-3" key={item.product._id}>
                <div className="flex items-center gap-3">
                  <img
                    alt={item.product.name}
                    className="h-14 w-14 rounded-2xl bg-brand-50 object-cover p-2 dark:bg-brand-950/30"
                    src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.product.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{currency((item.product.discountPrice || item.product.price) * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-dashed border-slate-300 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{currency(pricing.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {currency(pricing.discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span>{currency(pricing.deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white">
              <span>Total</span>
              <span>{currency(pricing.total)}</span>
            </div>
          </div>

          <Button className="mt-6 w-full" loading={placingOrder} onClick={placeOrder}>
            {paymentMethod === "COD" ? "Place COD order" : "Pay and place order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
