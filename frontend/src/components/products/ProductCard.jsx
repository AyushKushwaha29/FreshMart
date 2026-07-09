import { Heart, ShoppingBasket, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { currency } from "../../utils/formatters";

export default function ProductCard({ product, onAddToCart, onToggleWishlist, wished = false }) {
  return (
    <Link  to={`/products/${product.slug}`}
  className="card-hover block overflow-hidden rounded-4xl border border-white/60 bg-white/90 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 to-amber-50 p-5 dark:from-brand-950/50 dark:to-slate-800">
        <button
          className={`absolute right-4 top-4 rounded-full p-2 ${wished ? "bg-rose-500 text-white" : "bg-white/80 text-slate-700"} dark:bg-slate-900/80 dark:text-slate-100`}
          onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  onToggleWishlist?.(product._id);
}}
          type="button"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
        <img
          alt={product.name}
          className="mx-auto h-40 w-full object-contain transition duration-500 hover:scale-105"
          src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"}
        />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold text-slate-900 hover:text-brand-700 dark:text-white" >
              {product.name}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category?.name} · {product.unit}</p>
          </div>
          {product.discountPrice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
              <Tag className="h-3 w-3" />
              Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{currency(product.discountPrice || product.price)}</p>
            {product.discountPrice && <p className="text-sm text-slate-400 line-through">{currency(product.price)}</p>}
          </div>
          <Button
  className="rounded-full px-4 py-2"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product._id);
  }}
>
            <ShoppingBasket className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}

