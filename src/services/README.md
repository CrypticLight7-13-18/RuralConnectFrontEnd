# API Services Architecture

This document outlines the organized API service structure for the frontend application.

## Service Files Created

### 1. `/src/services/api.js` (Base Configuration)

- Contains the main `axiosInstance` with base URL and default configurations
- Handles cookies with `withCredentials: true`
- Centralized backend URL configuration

### 2. `/src/services/auth.js` (Authentication)

- `login()` - User authentication
- `signup()` - User registration
- `logout()` - User logout
- `fetchUserProfile()` - Get current user data

### 3. `/src/services/payment.js` (Payment Processing)

- `createCheckoutSession()` - Create Stripe checkout session
- `processCODOrder()` - Handle Cash on Delivery orders
- `verifyPayment()` - Verify payment status (optional)

### 4. `/src/services/orders.js` (Order Management)

- `placeOrder()` - Create new order
- `getOrderHistory()` - Fetch user's orders
- `getOrderById()` - Get specific order details
- `updateOrderStatus()` - Update order status
- `cancelOrder()` - Cancel an order

## Benefits of This Architecture

### ✅ **Consistency**

- All API calls use the same `axiosInstance`
- Uniform error handling across the application
- Consistent request/response format

### ✅ **Maintainability**

- Centralized API endpoints
- Easy to update base URL or authentication
- Service-specific error messages

### ✅ **Reusability**

- Services can be imported and used in any component
- Reduces code duplication
- Clean separation of concerns

### ✅ **Type Safety** (Future Enhancement)

- Easy to add TypeScript definitions
- Better IDE support and autocompletion

## Usage Examples

### In Components:

```javascript
// Payment component
import { createCheckoutSession, processCODOrder } from "../../services/payment";

// Order history component
import { getOrderHistory } from "../../services/orders";

// Authentication component
import { login, fetchUserProfile } from "../../services/auth";
```

### Configuration:

```javascript
// Update backend URL in one place
export const backendURL = "http://localhost:3000";
// or
export const backendURL = "https://your-production-api.com";
```

## Migration Complete

The `GoToPayment` component now uses:

- ✅ `axiosInstance` instead of raw fetch
- ✅ Dedicated payment service functions
- ✅ Proper error handling
- ✅ Consistent API structure

All payment-related API calls are now centralized and consistent with the rest of the application architecture.
