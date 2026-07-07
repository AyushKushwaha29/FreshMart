export const calculatePricing = ({ items, coupon = null }) => {
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.discountPrice ?? item.price;
    return sum + basePrice * item.quantity;
  }, 0);

  let discount = 0;

  if (coupon?.discountType === "percent") {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  if (coupon?.discountType === "flat") {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);

  const discountedSubtotal = subtotal - discount;
  const deliveryFee = discountedSubtotal >= 399 ? 0 : 29;
  const tax = 0;
  const total = discountedSubtotal + deliveryFee + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    tax,
    total: Number(total.toFixed(2))
  };
};

