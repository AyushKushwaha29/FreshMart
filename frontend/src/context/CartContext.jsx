import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [pricing, setPricing] = useState({});
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      setPricing({});
      setCoupon(null);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data.data.cart);
      setPricing(data.data.pricing);
      setCoupon(data.data.coupon);
    } catch (error) {
      setCart({ items: [] });
      setPricing({});
      setCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async ({ productId, quantity = 1 }) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      await api.post("/cart/items", { productId, quantity });
      toast.success("Added to cart");
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.patch(`/cart/items/${productId}`, { quantity });
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/items/${productId}`);
      toast.success("Removed from cart");
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post("/cart/coupon", { code });
      toast.success(data.message);
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      await api.delete("/cart/coupon");
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      await refreshCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        pricing,
        coupon,
        loading,
        cartCount: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
