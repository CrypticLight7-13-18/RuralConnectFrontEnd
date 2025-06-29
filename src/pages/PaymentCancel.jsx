import React from "react";
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    // Navigate back to the store or cart
    navigate("/store");
  };

  const handleContactSupport = () => {
    // You can implement contact support logic here
    window.location.href =
      "mailto:support@pharmaconnect.com?subject=Payment Issue";
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        {/* Reason Info */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">What happened?</h3>
          <p className="text-sm text-yellow-700">
            The payment process was interrupted. This could be due to:
          </p>
          <ul className="text-sm text-yellow-700 mt-2 text-left list-disc list-inside">
            <li>Payment window was closed</li>
            <li>Session timeout</li>
            <li>Network connectivity issues</li>
            <li>Payment method declined</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Try Payment Again
          </button>

          <button
            onClick={() => navigate("/store")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Store
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full bg-orange-100 text-orange-700 py-3 rounded-lg hover:bg-orange-200 transition duration-200 font-medium flex items-center justify-center"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you're experiencing payment issues, our support team is here to
            help.
          </p>
          <div className="text-xs text-gray-500">
            <p>Email: support@pharmaconnect.com</p>
            <p>Phone: +91 1234567890</p>
            <p>Available: Mon-Fri, 9AM-6PM IST</p>
          </div>
        </div>

        {/* Order Preservation Note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Don't worry! Your cart items are still saved. You can complete your
            purchase anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
