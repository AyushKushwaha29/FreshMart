import { ArrowRight, Clock3, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import SectionHeading from "../components/common/SectionHeading";
import ProductCard from "../components/products/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import api, { getErrorMessage } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const requests = [api.get("/categories"), api.get("/products/featured"), api.get("/coupons/active")];

        if (isAuthenticated) {
          requests.push(api.get("/wishlist"));
        }

        const responses = await Promise.all(requests);
        setCategories(responses[0].data.data);
        setFeaturedProducts(responses[1].data.data);
        setCoupons(responses[2].data.data.slice(0, 2));

        if (isAuthenticated) {
          setWishlistIds(responses[3].data.data.items.map((item) => item._id));
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to use your wishlist");
      return;
    }

    const wished = wishlistIds.includes(productId);

    try {
      if (wished) {
        await api.delete(`/wishlist/${productId}`);
        setWishlistIds((current) => current.filter((id) => id !== productId));
      } else {
        await api.post(`/wishlist/${productId}`);
        setWishlistIds((current) => [...current, productId]);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <section className="section-space">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-200">
              <Sparkles className="h-4 w-4" />
              Fresh in minutes
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white md:text-6xl">
              Blink-fast groceries with a sharper focus on produce.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              FreshMart brings the best fruits and vegetables to your doorstep with reliable inventory, polished checkout, invoices, SMS updates, and a premium mobile-first experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button className="rounded-full px-6">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/orders">
                <Button className="rounded-full px-6" variant="secondary">
                  Track My Orders
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Clock3, label: "15 min slots" },
                { icon: Truck, label: "Smooth delivery ops" },
                { icon: ShieldCheck, label: "Secure payments" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="glass-panel rounded-3xl p-4" key={item.label}>
                    <Icon className="h-5 w-5 text-brand-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            className="relative"
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
          >
            <div className="glass-panel rounded-[2.5rem] p-5">
              <img
                alt="Fresh produce"
                className="h-[420px] w-full rounded-[2rem] object-cover"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-4xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <p className="text-sm text-slate-500">Today&apos;s spotlight</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">Organic Alphonso</p>
              <p className="text-sm text-brand-600">Up to 18% off</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell space-y-6">
          <SectionHeading
            eyebrow="Categories"
            title="Shop by aisle, not by overwhelm"
            description="The first FreshMart release focuses on fruits and vegetables only, so the storefront feels fast and intentional."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                className="card-hover rounded-4xl border border-white/60 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900"
                key={category._id}
                to={`/products?category=${category.slug}`}
              >
                <div className="rounded-3xl bg-gradient-to-br from-brand-100 to-amber-50 p-4 dark:from-brand-950/40 dark:to-slate-800">
                  <img
                    alt={category.name}
                    className="h-28 w-full rounded-3xl object-cover"
                    src={category.image?.url || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"}
                  />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">{category.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell space-y-6">
          <SectionHeading
            eyebrow="Featured"
            title="Most-loved produce right now"
            description="Curated picks that showcase what the storefront looks and feels like when real shoppers land here."
            action={
              <Link className="text-sm font-semibold text-brand-700" to="/products">
                View all products
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
              : featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    onAddToCart={(productId) => addToCart({ productId, quantity: 1 })}
                    onToggleWishlist={toggleWishlist}
                    product={product}
                    wished={wishlistIds.includes(product._id)}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="grid gap-6 rounded-[2.5rem] bg-brand-700 p-8 text-white shadow-soft lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-100">Coupons + loyalty</p>
              <h2 className="mt-3 font-display text-4xl font-bold">Built-in offer engine for repeat shoppers</h2>
              <p className="mt-4 max-w-2xl text-sm text-brand-100">
                Apply coupons, check live pricing, and retain clean order accounting across COD and online payments.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {coupons.map((coupon) => (
                <div className="rounded-4xl bg-white/10 p-5 backdrop-blur" key={coupon._id}>
                  <p className="text-sm text-brand-100">Promo code</p>
                  <p className="mt-2 font-display text-2xl font-bold">{coupon.code}</p>
                  <p className="mt-3 text-sm text-brand-100">{coupon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
