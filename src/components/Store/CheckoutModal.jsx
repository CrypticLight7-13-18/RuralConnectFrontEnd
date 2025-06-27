import { Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';
import React, { useState, useMemo } from 'react';
export default function CheckoutModal({ cart, total, changeQty, removeItem, onClose }) {
  // Example saved addresses (you can fetch from API/store)
  const colors = {
  lightestBlue: '#e0fbfc',
  lightBlue:    '#c2dfe3',
  mediumBlue:   '#9db4c0',
  darkBlue:     '#5c6b73',
  darkestBlue:  '#253237',
};
  const [addresses, setAddresses] = useState([
    '123 Main St, Springfield',
    '456 Elm St, Shelbyville'
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || '');
  const [addingNew, setAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses(prev => [...prev, newAddress.trim()]);
    setSelectedAddress(newAddress.trim());
    setNewAddress('');
    setAddingNew(false);
  };

  const handlePay = () => {
    const orderData = {
      cart,
      total,
      address: selectedAddress,
      paymentMethod
    };
    console.log('Proceeding with order:', orderData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          style={{ borderTop: `6px solid ${colors.mediumBlue}` }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <X size={18} />
          </button>

          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: colors.darkestBlue }}>
              Order Review & Checkout
            </h3>

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus size={12} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <p className="text-right font-bold text-lg" style={{ color: colors.darkestBlue }}>
              Total: ₹{total}
            </p>

            {/* Delivery Address */}
            <div className="space-y-2">
              <label className="block font-medium">Delivery Address</label>
              <select
                value={selectedAddress}
                onChange={e => setSelectedAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {addresses.map((addr, idx) => (
                  <option key={idx} value={addr}>{addr}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setAddingNew(!addingNew)}
                className="text-sm text-blue-600 hover:underline"
              >
                {addingNew ? 'Cancel New Address' : 'Add New Address'}
              </button>

              {addingNew && (
            <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded">
              <input
                type="text"
                placeholder="Enter new address"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={handleAddAddress}
                className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
              >
                Save Address
              </button>
            </div>
          )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="px-4 py-2 rounded-lg bg-green-400 text-white hover:bg-green-500 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}