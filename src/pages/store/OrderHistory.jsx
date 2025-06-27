import { OrderCard } from "../../components/Store/OrderCard";


const colors = {
  lightestBlue: '#e0fbfc',
  lightBlue: '#c2dfe3',
  mediumBlue: '#9db4c0',
  darkBlue: '#5c6b73',
  darkestBlue: '#253237',
};
// Example data - replace with real API call
const orders = [
  {
    id: 'track123',
    items: [{ name: 'Paracet 500mg', qty: 2 }],
    deliveryDate: '2025-06-30',
  },
  {
    id: 'track456',
    items: [
      { name: 'Vitamin C 500mg', qty: 1 },
      { name: 'Multivitamin', qty: 3 },
    ],
    deliveryDate: '2025-07-02',
  },
];

export function OrderHistoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-darkestBlue">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
