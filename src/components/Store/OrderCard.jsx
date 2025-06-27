function Button({ children, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-darkBlue hover:bg-darkestBlue text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'bg-transparent border border-darkBlue text-darkBlue hover:bg-lightestBlue',
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}


const colors = {
  lightestBlue: '#e0fbfc',
  lightBlue: '#c2dfe3',
  mediumBlue: '#9db4c0',
  darkBlue: '#5c6b73',
  darkestBlue: '#253237',
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}


export function OrderCard({ order }) {
  // Example: order = { id: 'track123', items: [{name: 'Paracet 500mg', qty: 2}], deliveryDate: '2025-06-30' }
  return (
    <div className="p-4 rounded-lg shadow-md mb-4" style={{ backgroundColor: '#e0fbfc' }}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-darkestBlue">Tracking ID: {order.id}</h3>
        <span className="text-darkBlue">{formatDate(order.deliveryDate)}</span>
      </div>
      <div className="mt-2 mb-4">
        <h4 className="font-medium text-darkestBlue">Items Ordered:</h4>
        <ul className="list-disc list-inside text-darkBlue">
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.qty}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <Button variant="danger" onClick={() => console.log('Cancel order:', order.id)}>
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
