import { ArrowRight, TicketPercent, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import QuantityControl from "../components/products/QuantityControl";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/formatters";

export default function CartPage() {
  const { cart, pricing, coupon, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  if (!cart.items?.length) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState
            actionLabel="Start shopping"
            description="Add fruits and vegetables to your cart to continue toward checkout."
            onAction={() => navigate("/products")}
            title="Your cart is empty"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="page-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[2.5rem] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Your cart</h1>
          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div className="flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between" key={item.product._id}>
                <div className="flex items-center gap-4">
                  <img
                    alt={item.product.name}
                    className="h-24 w-24 rounded-3xl bg-brand-50 object-cover p-3 dark:bg-brand-950/30"
                    src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"}
                  />
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {currency(item.product.discountPrice || item.product.price)} · {item.product.unit}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <QuantityControl
                    onDecrease={() => updateQuantity(item.product._id, item.quantity - 1)}
                    onIncrease={() => updateQuantity(item.product._id, item.quantity + 1)}
                    quantity={item.quantity}
                  />
                  <p className="min-w-24 text-right font-semibold text-slate-900 dark:text-white">
                    {currency((item.product.discountPrice || item.product.price) * item.quantity)}
                  </p>
                  <button className="rounded-full p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={() => removeItem(item.product._id)} type="button">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
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
            <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-3 text-lg font-bold text-slate-900 dark:border-slate-700 dark:text-white">
              <span>Total</span>
              <span>{currency(pricing.total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-4xl bg-brand-50 p-4 dark:bg-brand-950/30">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-200">
              <TicketPercent className="h-4 w-4" />
              <p className="text-sm font-semibold">Apply coupon</p>
            </div>
            {coupon ? (
              <div className="mt-3 flex items-center justify-between rounded-3xl bg-white px-4 py-3 dark:bg-slate-900">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{coupon.code}</p>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                </div>
                <Button onClick={removeCoupon} variant="ghost">
                  Remove
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <Input onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter code" value={couponCode} />
                <Button className="w-full" onClick={() => applyCoupon(couponCode)}>
                  Apply coupon
                </Button>
              </div>
            )}
          </div>

          <Link to="/checkout">
            <Button className="mt-6 w-full justify-between">
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
