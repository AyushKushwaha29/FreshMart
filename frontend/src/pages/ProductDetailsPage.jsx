import { Heart, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import ProductCard from "../components/products/ProductCard";
import QuantityControl from "../components/products/QuantityControl";
import SectionHeading from "../components/common/SectionHeading";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import api, { getErrorMessage } from "../services/api";
import { currency } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import ProductImageGallery from "../components/products/ProductImageGallery";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

useEffect(() => {
  setActiveImage(0);
}, [product]);
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const requests = [api.get(`/products/${slug}`)];

        if (isAuthenticated) {
          requests.push(api.get("/wishlist"));
        }
        const [productResponse, wishlistResponse] = await Promise.all(requests);
        setProduct(productResponse.data.data.product);
        setRelatedProducts(productResponse.data.data.relatedProducts);

        if (wishlistResponse) {
          setWishlistIds(wishlistResponse.data.data.items.map((item) => item._id));
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug, isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to use your wishlist");
      return;
    }
    try {
      if (wishlistIds.includes(productId)) {
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
  if (loading || !product) {
    return (
      <div className="section-space">
        <div className="page-shell grid gap-8 lg:grid-cols-2">
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="section-space">
      <div className="page-shell space-y-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[2.5rem] p-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-brand-100 to-amber-50 p-8 dark:from-brand-950/40 dark:to-slate-800">
             <div className="relative">
  <AnimatePresence mode="wait">
    <div className="group relative overflow-hidden rounded-2xl">
  <motion.img
    key={activeImage}
    src={
      product.images?.[activeImage]?.url ||
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"
    }
    alt={product.name}
    className="mx-auto h-[380px] w-full object-contain transition-transform duration-500 hover:scale-125 cursor-zoom-in"
    initial={{
      opacity: 0,
      scale: 0.92
    }}
    animate={{
      opacity: 1,
      scale: 1
    }}
    exit={{
      opacity: 0,
      scale: 1.08
    }}
    transition={{
      duration: 0.35
    }}
  /></div>
</AnimatePresence>
<div className="mt-6 flex gap-3 justify-center flex-wrap">
  {product.images?.map((image, index) => (
    <button
      key={index}
      onClick={() => setActiveImage(index)}
      className={`overflow-hidden rounded-xl border-2 transition
      ${
        activeImage === index
? "border-brand-600 scale-105 shadow-lg"
: "border-transparent hover:border-slate-300"
      }`}
    >
      <img
        src={image.url}
        className="h-20 w-20 rounded-xl object-cover transition duration-300 hover:scale-110"
      />
    </button>
      ))}
   </div>

  {/* Image Counter */}
  <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
    {activeImage + 1} / {product.images.length}
  </div>

  {/* Left Button */}

  {activeImage > 0 && (
    <button
      onClick={() => setActiveImage(activeImage - 1)}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur transition hover:scale-110 hover:bg-white"
    >
      ◀
    </button>
  )}

  {/* Right Button */}

  {activeImage < product.images.length - 1 && (
    <button
      onClick={() => setActiveImage(activeImage + 1)}
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full h-10 w-10 shadow-lg"
    >
      ▶
    </button>
  )}

</div>




            </div>
          </div>
          <div className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-brand-600">{product.category?.name}</p>
                <h1 className="mt-3 font-display text-4xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
                <p className="mt-4 text-slate-600 dark:text-slate-300">{product.description}</p>
              </div>
              <button
                className={`rounded-full p-3 ${wishlistIds.includes(product._id) ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100"}`}
                onClick={() => toggleWishlist(product._id)}
                type="button"
              >
                <Heart className={`h-5 w-5 ${wishlistIds.includes(product._id) ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <div>
                <p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{currency(product.discountPrice || product.price)}</p>
                {product.discountPrice && <p className="mt-1 text-sm text-slate-400 line-through">{currency(product.price)}</p>}
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-200">
                {product.unit}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantityControl
                onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                onIncrease={() => setQuantity((current) => current + 1)}
                quantity={quantity}
              />
              <Button className="px-6" onClick={() => addToCart({ productId: product._id, quantity })}>
                Add {quantity} to cart
              </Button>
              <Link to="/cart">
                <Button variant="secondary">Go to cart</Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Quality checked" },
                { icon: Truck, title: "Fast delivery" },
                { icon: Heart, title: "Wishlist enabled" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-800" key={item.title}>
                    <Icon className="h-5 w-5 text-brand-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading eyebrow="More to try" title="Related produce picks" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                onAddToCart={(productId) => addToCart({ productId, quantity: 1 })}
                onToggleWishlist={toggleWishlist}
                product={item}
                wished={wishlistIds.includes(item._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

