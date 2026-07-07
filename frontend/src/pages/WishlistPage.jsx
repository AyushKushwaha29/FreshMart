import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../components/products/ProductCard";
import SectionHeading from "../components/common/SectionHeading";
import EmptyState from "../components/ui/EmptyState";
import api, { getErrorMessage } from "../services/api";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await loadWishlist();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="section-space">
      <div className="page-shell space-y-6">
        <SectionHeading eyebrow="Wishlist" title="Saved for your next basket" />
        {!loading && !wishlist?.items?.length ? (
          <EmptyState
            actionLabel="Browse products"
            description="Your wishlist is empty right now. Save products here to revisit them quickly."
            onAction={() => navigate("/products")}
            title="No saved products yet"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {wishlist?.items?.map((product) => (
              <ProductCard
                key={product._id}
                onAddToCart={(productId) => addToCart({ productId, quantity: 1 })}
                onToggleWishlist={toggleWishlist}
                product={product}
                wished
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
