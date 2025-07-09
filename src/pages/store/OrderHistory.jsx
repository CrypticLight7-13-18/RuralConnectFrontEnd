import { useEffect, useState } from "react";
import { OrderCard } from "../../components/Store/OrderCard";
import { fetchUserOrders } from "../../services/order";
import { fetchUserProfile } from "../../services/auth";
import { useError } from "../../contexts/ErrorContext";

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addError } = useError();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await fetchUserProfile();

        const fetchedOrders = await fetchUserOrders(user._id, { limit: 20 });

        const transformedOrders = fetchedOrders.map((order) => ({
          id: order._id,
          trackingId: order.trackingId || order._id,
          items: order.orderItems.map((item) => ({
            name: item.medicineId?.name || item.name || "Unknown Medicine",
            qty: item.quantity,
            price: item.price,
          })),
          totalAmount: order.totalAmount,
          status: order.status,
          orderDate: order.createdAt,
          deliveryDate: order.deliveryDate,
          deliveryAddress: order.deliveryAddress,
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      // Import cancelOrder from services if not already imported
      const { cancelOrder } = await import("../../services/order");
      await cancelOrder(orderId);

      // Update the orders list by removing the cancelled order or updating its status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
      addError("Failed to cancel order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4 text-red-800">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        <div className="text-sm text-gray-600">
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't placed any orders yet.
            </p>
            <a
              href="/store"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancelOrder={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
