import React, { useEffect, useState } from "react";
import { CheckCircle, Package, Home, Receipt } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../services/api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (sessionId) {
        try {
          // Verify payment with our new backend endpoint
          const response = await axiosInstance.get(
            `/api/payment/success/${sessionId}`
          );

          if (response.data.success) {
            setOrderDetails({
              orderId: response.data.orderId,
              sessionId: sessionId,
              amount: "Processed via Stripe",
              paymentMethod: "Card Payment",
              estimatedDelivery: "7 days",
            });
          } else {
            throw new Error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          // Show error state or redirect
          setOrderDetails(null);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Receipt className="w-4 h-4 mr-2" />
              Order Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium">
                  {orderDetails.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium">
                  {orderDetails.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Package className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-800">Order Processing</span>
          </div>
          <p className="text-sm text-blue-700">
            Your order is being prepared and will be shipped within 24 hours.
            You'll receive a tracking number via email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/store/order-history")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            View Order History
          </button>

          <button
            onClick={() => navigate("/store")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions about your order? Contact our support team at{" "}
            <a
              href="mailto:support@pharmaconnect.com"
              className="text-blue-600 hover:underline"
            >
              support@pharmaconnect.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
