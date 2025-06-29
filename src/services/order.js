import axiosInstance from "./api";

// Create a new order. orderData should match backend requirements
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/api/orders", orderData);
  return response.data.data;
};

// Fetch orders for the logged-in user. Requires userId
export const fetchUserOrders = async (userId, params = {}) => {
  const response = await axiosInstance.get(`/api/orders/user/${userId}`, {
    params,
  });
  return response.data.data;
};

// Fetch a single order by its id
export const fetchOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/api/orders/${orderId}`);
  return response.data.data;
};

// Cancel an order (customer)
export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.patch(`/api/orders/${orderId}/cancel`);
  return response.data.data;
};

// Admin: update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(`/api/orders/${orderId}/status`, {
    status,
  });
  return response.data.data;
};

// Admin: fetch all orders
export const fetchAllOrders = async (params = {}) => {
  const response = await axiosInstance.get("/api/orders", { params });
  return response.data.data;
};
