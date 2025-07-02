import axiosInstance from "./api.js";
import { createOrder } from "./order.js";

/**
 * Create a Stripe checkout session for payment processing
 * @param {Object} paymentData - Payment information
 * @param {string} paymentData.method - Payment method ('card', 'upi', 'cod')
 * @param {Object} paymentData.orderData - Order details including cart, total, address
 * @returns {Promise<Object>} - Stripe session data
 */
export const createCheckoutSession = async (paymentData) => {
  try {
    const response = await axiosInstance.post(
      "/api/payment/create-checkout-session",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    throw error;
  }
};

/**
 * Process a Cash on Delivery order
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} - Order confirmation
 */
export const processCODOrder = async (orderData) => {
  try {
    // Create the order in your database for COD
    const orderPayload = {
      ...orderData,
      paymentStatus: "pending",
      orderStatus: "confirmed",
      paymentMethod: "cod",
    };

    const result = await createOrder(orderPayload);
    return result;
  } catch (error) {
    console.error("Failed to process COD order:", error);
    throw error;
  }
};

/**
 * Process a Card/UPI payment by creating order first, then Stripe session
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} - Stripe session data with order ID
 */
export const processCardPayment = async (orderData) => {
  try {
    // First create the order in your database with pending payment status
    const orderPayload = {
      ...orderData,
      paymentStatus: "pending",
      orderStatus: "pending", // Will be updated after successful payment
      paymentMethod: "card",
    };

    const orderResult = await createOrder(orderPayload);

    // Then create Stripe checkout session with order ID
    const sessionData = await createCheckoutSession({
      method: "card",
      orderData: {
        ...orderData,
        orderId: orderResult._id, // Include order ID
      },
    });

    return {
      ...sessionData,
      orderId: orderResult._id,
    };
  } catch (error) {
    console.error("Failed to process card payment:", error);
    throw error;
  }
};

/**
 * Verify payment status (optional - for webhook handling)
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} - Payment verification result
 */
export const verifyPayment = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/payment/verify/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to verify payment:", error);
    throw error;
  }
};
