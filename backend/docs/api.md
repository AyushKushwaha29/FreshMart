# FreshMart API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST `/auth/request-otp`
- Description: Sends an OTP to the provided mobile number using MSG91.
- Auth: Public
- Body:
```json
{
  "mobile": "9876543210",
  "name": "Ayush"
}
```

### POST `/auth/verify-otp`
- Description: Verifies the OTP and returns a JWT token.
- Auth: Public
- Body:
```json
{
  "mobile": "9876543210",
  "otp": "123456",
  "name": "Ayush"
}
```

### POST `/auth/admin/login`
- Description: Signs in an admin using email and password.
- Auth: Public
- Body:
```json
{
  "email": "admin@freshmart.in",
  "password": "FreshMart@123"
}
```

### GET `/auth/me`
- Description: Returns the authenticated user profile.
- Auth: Bearer token

### PUT `/auth/profile`
- Description: Updates the signed-in user profile.
- Auth: Bearer token
- Body:
```json
{
  "name": "Ayush Verma",
  "email": "ayush@example.com"
}
```

## Categories

### GET `/categories`
- Description: Returns all active categories.
- Auth: Public

### POST `/categories`
- Description: Creates a category.
- Auth: Admin

### PUT `/categories/:id`
- Description: Updates a category.
- Auth: Admin

### DELETE `/categories/:id`
- Description: Deletes a category if no products use it.
- Auth: Admin

## Products

### GET `/products`
- Description: Returns paginated products.
- Auth: Public
- Query params: `search`, `category`, `sort`, `page`, `limit`, `featured`, `availability`

### GET `/products/featured`
- Description: Returns featured products for the home page.
- Auth: Public

### GET `/products/:slug`
- Description: Returns a single product and related products.
- Auth: Public

### POST `/products`
- Description: Creates a product.
- Auth: Admin

### PUT `/products/:id`
- Description: Updates a product.
- Auth: Admin

### DELETE `/products/:id`
- Description: Deletes a product.
- Auth: Admin

## Cart

### GET `/cart`
- Description: Returns the user cart with pricing summary.
- Auth: Bearer token

### POST `/cart/items`
- Description: Adds a product to the cart.
- Auth: Bearer token
- Body:
```json
{
  "productId": "66d1c4d0e6f5e4cdbbe7fd11",
  "quantity": 2
}
```

### PATCH `/cart/items/:productId`
- Description: Updates quantity for a cart item. Set `0` to remove.
- Auth: Bearer token

### DELETE `/cart/items/:productId`
- Description: Removes a product from the cart.
- Auth: Bearer token

### DELETE `/cart`
- Description: Clears the entire cart.
- Auth: Bearer token

### POST `/cart/coupon`
- Description: Applies a coupon to the cart.
- Auth: Bearer token
- Body:
```json
{
  "code": "FRESH10"
}
```

### DELETE `/cart/coupon`
- Description: Removes the applied coupon.
- Auth: Bearer token

## Wishlist

### GET `/wishlist`
- Description: Returns the authenticated user's wishlist.
- Auth: Bearer token

### POST `/wishlist/:productId`
- Description: Adds a product to the wishlist.
- Auth: Bearer token

### DELETE `/wishlist/:productId`
- Description: Removes a product from the wishlist.
- Auth: Bearer token

## Addresses

### GET `/addresses`
- Description: Returns all saved addresses for the user.
- Auth: Bearer token

### POST `/addresses`
- Description: Creates a new address.
- Auth: Bearer token

### PUT `/addresses/:id`
- Description: Updates an existing address.
- Auth: Bearer token

### DELETE `/addresses/:id`
- Description: Deletes an address.
- Auth: Bearer token

### PATCH `/addresses/:id/default`
- Description: Marks an address as the default address.
- Auth: Bearer token

## Coupons

### GET `/coupons/active`
- Description: Returns active coupons for the storefront.
- Auth: Public

### POST `/coupons/validate`
- Description: Validates a coupon against the signed-in user's cart.
- Auth: Bearer token

### GET `/coupons`
- Description: Returns all coupons.
- Auth: Admin

### POST `/coupons`
- Description: Creates a coupon.
- Auth: Admin

### PUT `/coupons/:id`
- Description: Updates a coupon.
- Auth: Admin

### DELETE `/coupons/:id`
- Description: Deletes a coupon.
- Auth: Admin

## Orders

### POST `/orders/cod`
- Description: Places a cash-on-delivery order, generates invoice, and sends SMS.
- Auth: Bearer token
- Body:
```json
{
  "addressId": "66d1c4d0e6f5e4cdbbe7fd11"
}
```

### GET `/orders`
- Description: Returns order history for the logged-in customer.
- Auth: Bearer token

### GET `/orders/:id`
- Description: Returns a single order. Customers can only access their own orders.
- Auth: Bearer token

### GET `/orders/:id/invoice`
- Description: Returns the generated invoice URL for an order.
- Auth: Bearer token

## Payments

### POST `/payments/razorpay/order`
- Description: Creates a Razorpay order based on the current cart snapshot.
- Auth: Bearer token
- Body:
```json
{
  "addressId": "66d1c4d0e6f5e4cdbbe7fd11"
}
```

### POST `/payments/razorpay/verify`
- Description: Verifies Razorpay signature, creates the order, generates invoice, and sends SMS.
- Auth: Bearer token
- Body:
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

## Uploads

### POST `/uploads/images`
- Description: Uploads product images to Cloudinary or local fallback storage.
- Auth: Admin
- Content-Type: `multipart/form-data`

## Admin

### GET `/admin/dashboard`
- Description: Returns headline metrics and recent orders.
- Auth: Admin

### GET `/admin/orders`
- Description: Returns all orders. Supports optional `status` filter.
- Auth: Admin

### PATCH `/admin/orders/:id/status`
- Description: Updates order fulfillment status.
- Auth: Admin
- Body:
```json
{
  "status": "Packed",
  "note": "Prepared and packed"
}
```

### GET `/admin/orders/export`
- Description: Exports orders as CSV.
- Auth: Admin

### GET `/admin/customers`
- Description: Returns all customer accounts.
- Auth: Admin

### GET `/admin/analytics/sales`
- Description: Returns daily sales for the last 30 days and top selling products.
- Auth: Admin

### GET `/admin/revenue`
- Description: Returns revenue grouped by payment method.
- Auth: Admin

