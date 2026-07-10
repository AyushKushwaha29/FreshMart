import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../components/products/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api, { getErrorMessage } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { socket } from "../services/socket";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const deferredSearch = useDeferredValue(search);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (deferredSearch) params.set("search", deferredSearch);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);

        setSearchParams(params, { replace: true });

        const requests = [api.get(`/products?${params.toString()}`)];

        if (isAuthenticated) {
          requests.push(api.get("/wishlist"));
        }

        const [productResponse, wishlistResponse] = await Promise.all(requests);
        setProducts(productResponse.data.data);

        if (wishlistResponse) {
          setWishlistIds(wishlistResponse.data.data.items.map((item) => item._id));
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [deferredSearch, category, sort, isAuthenticated, setSearchParams]);

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
  
  useEffect(() => {
  const handleInventoryUpdate = (updated) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === updated.productId
          ? {
              ...product,
              stock: updated.stock,
              availability: updated.availability
            }
          : product
      )
    );
  };

  socket.on("inventory-updated", handleInventoryUpdate);

  return () => {
    socket.off("inventory-updated", handleInventoryUpdate);
  };
}, []);


  return (
    <div className="section-space">
      <div className="page-shell space-y-6">
        <SectionHeading
          eyebrow="Catalogue"
          title="Fruits and vegetables that feel curated, not cluttered"
          description="Search, filter, and sort through a produce-first catalog with the same fast shopping rhythm users expect from modern grocery apps."
        />

        <div className="glass-panel rounded-4xl p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
            <Input label="Search products" onChange={(event) => setSearch(event.target.value)} placeholder="Try tomato, banana, avocado..." value={search} />
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) =>
                  startTransition(() => {
                    setCategory(event.target.value);
                  })
                }
                value={category}
              >
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item._id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Sort
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => { setSearch(""); setCategory(""); setSort("latest"); }} variant="secondary">
              Reset filters
            </Button>
            {categories.slice(0, 6).map((item) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item.slug ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-200"}`}
                key={item._id}
                onClick={() => setCategory(item.slug)}
                type="button"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
            : products.map((product) => (
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
    </div>
  );
}
