import { useEffect, useState } from "react";
import { OrderCard } from "../../components/Store/OrderCard";
import { fetchUserOrders } from "../../services/order";
import { fetchUserProfile } from "../../services/auth";

// Color palette reference (kept for potential future use)

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await fetchUserProfile();
        const fetched = await fetchUserOrders(user._id, { limit: 20 });
        setOrders(
          fetched.map((o) => ({
            id: o._id,
            items: o.orderItems.map((it) => ({
              name: it.medicineId.name,
              qty: it.quantity,
            })),
            deliveryDate: o.deliveryDate,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-darkestBlue">
        Order History
      </h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
