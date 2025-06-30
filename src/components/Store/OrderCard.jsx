function Button({ children, onClick, variant = "primary", className = "" }) {
  const variants = {
    primary: "bg-darkBlue hover:bg-darkestBlue text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline:
      "bg-transparent border border-darkBlue text-darkBlue hover:bg-lightestBlue",
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
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({ order, onCancelOrder }) {
  const canCancel =
    order.status &&
    order.status.toLowerCase() !== "cancelled" &&
    order.status.toLowerCase() !== "delivered";

  return (
    <div
      className="p-4 rounded-lg shadow-md mb-4"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold" style={{ color: colors.darkestBlue }}>
            Tracking ID: {order.trackingId || order.id}
          </h3>
          {order.status && (
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: colors.darkBlue }}>
            Delivery: {formatDate(order.deliveryDate)}
          </div>
          {order.totalAmount && (
            <div
              className="font-semibold"
              style={{ color: colors.darkestBlue }}
            >
              ₹{order.totalAmount}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2" style={{ color: colors.darkestBlue }}>
          Items Ordered:
        </h4>
        <ul className="space-y-1">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between text-sm"
              style={{ color: colors.darkBlue }}
            >
              <span>
                {item.name} × {item.qty}
              </span>
              {item.price && <span>₹{item.price * item.qty}</span>}
            </li>
          ))}
        </ul>
      </div>

      {order.deliveryAddress && (
        <div className="mb-4">
          <h4
            className="font-medium mb-1"
            style={{ color: colors.darkestBlue }}
          >
            Delivery Address:
          </h4>
          <p className="text-sm" style={{ color: colors.darkBlue }}>
            {order.deliveryAddress}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs" style={{ color: colors.darkBlue }}>
          Ordered: {formatDate(order.orderDate)}
        </div>
        {canCancel && onCancelOrder && (
          <Button variant="danger" onClick={() => onCancelOrder(order.id)}>
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
