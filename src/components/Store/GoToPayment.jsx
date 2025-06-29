import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { processCardPayment, processCODOrder } from "../../services/payment";
import OrderSuccessModal from "./OrderSuccessModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function GoToPayment({ cart, total, address, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);

  const handlePayment = async () => {
    try {
      const orderData = {
        cart,
        total,
        address,
        paymentMethod,
      };

      if (paymentMethod === "cod") {
        console.log("Cash on Delivery order:", orderData);
        const response = await processCODOrder(orderData);
        console.log("COD Order response:", response);

        // Store order response and show success modal
        setOrderResponse(response);
        setShowSuccessModal(true);
        return;
      }

      // For card payments, create order first then redirect to Stripe
      const paymentResult = await processCardPayment(orderData);

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: paymentResult.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setOrderResponse(null);
    onClose();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1 bg-green-100 rounded">
            <span className="text-green-600 text-sm">💳</span>
          </div>
          <h4 className="font-semibold text-gray-800">Payment Method</h4>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="card">💳 Credit / Debit Card</option>
            <option value="cod">💰 Cash on Delivery</option>
          </select>

          <div className="flex justify-end pt-4">
            <button
              onClick={handlePayment}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        orderData={{
          address,
          total,
          deliveryDate: orderResponse?.data?.deliveryDate,
        }}
        orderNumber={orderResponse?.data?.orderNumber}
      />
    </>
  );
}
