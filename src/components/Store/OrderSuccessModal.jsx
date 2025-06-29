import React from "react";
import { CheckCircle, Package, Calendar, MapPin, X } from "lucide-react";

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderData,
  orderNumber = null,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md relative animate-pulse"
          style={{ borderTop: `6px solid #10b981` }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your cash on delivery order has been confirmed.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              {orderNumber && (
                <div className="flex items-center mb-3">
                  <Package size={18} className="text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Order Number:</span>
                  <span className="font-semibold text-gray-800 ml-2">
                    {orderNumber}
                  </span>
                </div>
              )}

              <div className="flex items-center mb-3">
                <MapPin size={18} className="text-red-500 mr-2" />
                <span className="text-sm text-gray-600">Delivery Address:</span>
              </div>
              <p className="text-sm text-gray-800 ml-6 mb-3">
                {orderData?.address || "Address not provided"}
              </p>

              <div className="flex items-center mb-3">
                <Calendar size={18} className="text-purple-600 mr-2" />
                <span className="text-sm text-gray-600">
                  Expected Delivery:
                </span>
                <span className="text-sm text-gray-800 ml-2">
                  {orderData?.deliveryDate
                    ? new Date(orderData.deliveryDate).toLocaleDateString()
                    : "7 days from now"}
                </span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-green-600">
                    ₹{orderData?.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Payment: Cash on Delivery
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  // Navigate to orders page - you can implement this
                  console.log("Navigate to orders page");
                  onClose();
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
