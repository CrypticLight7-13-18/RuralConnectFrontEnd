import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  MapPin,
  Package,
} from "lucide-react";
import React, { useState } from "react";
import GoToPayment from "./GoToPayment";

export default function CheckoutModal({
  cart,
  total,
  changeQty,
  removeItem,
  onClose,
}) {
  const [addresses, setAddresses] = useState([
    "123 Main St, Springfield",
    "456 Elm St, Shelbyville",
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || "");
  const [addingNew, setAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses((prev) => [...prev, newAddress.trim()]);
    setSelectedAddress(newAddress.trim());
    setNewAddress("");
    setAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden relative border-t-4 border-blue-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Order Review
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cart.length} items in your cart
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
            <div className="p-6 space-y-6">
              {/* Cart Items Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Package size={18} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Order Items</h4>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          ₹{item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-2 py-1">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} className="text-gray-600" />
                          </button>
                          <span className="font-medium text-gray-800 min-w-[20px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} className="text-gray-600" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold text-gray-800">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    Order Total:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin size={18} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-800">
                    Delivery Address
                  </h4>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {addresses.map((addr, idx) => (
                      <option key={idx} value={addr}>
                        {addr}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setAddingNew(!addingNew)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    {addingNew ? "✕ Cancel" : "+ Add New Address"}
                  </button>

                  {addingNew && (
                    <div className="mt-3 space-y-3 bg-white p-3 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        placeholder="Enter your complete address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddAddress}
                        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t border-gray-200 pt-6">
                <GoToPayment
                  cart={cart}
                  total={total}
                  address={selectedAddress}
                  onClose={onClose}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel Order
              </button>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Secure checkout powered by
                </p>
                <p className="text-xs text-gray-500">SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
