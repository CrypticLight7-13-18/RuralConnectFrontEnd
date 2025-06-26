/*  FILE:  src/pages/patient/Store.jsx
    DESCRIPTION:
    – Product grid with Medicine cards
    – Sticky “Cart” panel under the grid
    – Checkout modal (blurred backdrop) with order review + payment selector
*/

import React, { useState, useMemo } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';

/* -------------------------------------------------- */
/* 1.  THEME  */
const colors = {
  lightestBlue: '#e0fbfc',
  lightBlue:    '#c2dfe3',
  mediumBlue:   '#9db4c0',
  darkBlue:     '#5c6b73',
  darkestBlue:  '#253237',
};

/* -------------------------------------------------- */
/* 2.  MOCK MEDICINE DATA  (replace with API later)  */
const DUMMY_MEDICINES = [
  {
    id: 'm1',
    name: 'Paracet 500mg',
    price: 40,
    description: 'Fever & mild-pain relief',
    img: 'https://source.unsplash.com/200x160/?pill',
  },
  {
    id: 'm2',
    name: 'Amoxy 250mg',
    price: 120,
    description: 'Broad-spectrum antibiotic',
    img: 'https://source.unsplash.com/200x160/?medicine',
  },
  {
    id: 'm3',
    name: 'Vit-C ChewTabs',
    price: 150,
    description: 'Immunity booster (orange)',
    img: 'https://source.unsplash.com/200x160/?vitamin',
  },
  {
    id: 'm4',
    name: 'Cetirizine 10mg',
    price: 25,
    description: 'Anti-allergic relief',
    img: 'https://source.unsplash.com/200x160/?capsule',
  },
];

/* -------------------------------------------------- */
/* 3.  MEDICINE CARD  */
function MedicineCard({ product, onAdd }) {
  return (
    <div
      className="flex flex-col rounded-lg shadow hover:shadow-lg transition overflow-hidden"
      style={{ border: `2px solid ${colors.lightBlue}`, background: 'white' }}
    >
      <img
        src={product.img}
        alt={product.name}
        className="h-40 object-cover w-full"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold mb-1"
          style={{ color: colors.darkestBlue }}
        >
          {product.name}
        </h3>
        <p className="text-xs mb-2" style={{ color: colors.darkBlue }}>
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold" style={{ color: colors.darkBlue }}>
            ₹{product.price}
          </span>
          <button
            onClick={() => onAdd(product)}
            className="px-3 py-1 rounded-full text-sm flex items-center space-x-1"
            style={{ background: colors.darkBlue, color: 'white' }}
          >
            <Plus size={14} /> <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* 4.  MAIN STORE PAGE  */
export default function StorePage() {
  /* cart = { id, name, price, qty }[] */
  const [cart, setCart]         = useState([]);
  const [showCheckout, setShow] = useState(false);

  /* ----- cart helpers ----- */
  const addToCart = (prod) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === prod.id);
      if (existing) {
        return prev.map((i) =>
          i.id === prod.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const changeQty = (id, delta) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  /* ----- render ----- */
  return (
    <div
      className="min-h-screen p-6"
      style={{ background: colors.lightestBlue }}
    >
      {/* Header */}
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: colors.darkestBlue }}
      >
        Pharmacy Store
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_MEDICINES.map((m) => (
          <MedicineCard key={m.id} product={m} onAdd={addToCart} />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-10">
        <h2
          className="text-xl font-semibold mb-4 flex items-center"
          style={{ color: colors.darkestBlue }}
        >
          <ShoppingCart className="mr-2" /> Cart ({cart.length})
        </h2>

        {cart.length === 0 ? (
          <p style={{ color: colors.darkBlue }}>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-3 rounded"
                  style={{ borderLeft: `4px solid ${colors.mediumBlue}` }}
                >
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.darkestBlue }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="p-1 rounded"
                      style={{ background: colors.lightBlue }}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="p-1 rounded"
                      style={{ background: colors.lightBlue }}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded"
                      style={{ color: colors.darkBlue }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="flex justify-between items-center">
              <span
                className="font-bold text-lg"
                style={{ color: colors.darkestBlue }}
              >
                Total: ₹{total}
              </span>
              <button
                onClick={() => setShow(true)}
                className="px-4 py-2 rounded text-white"
                style={{ background: colors.darkBlue }}
              >
                Go to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
     {showCheckout && (
  <CheckoutModal
    cart={cart}
    total={total}
    changeQty={changeQty}
    removeItem={removeItem}
    onClose={() => setShow(false)}
  />
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* 5.  CHECKOUT MODAL  */
// src/pages/patient/CheckoutModal.jsx


// import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';


export  function CheckoutModal({ cart, total, changeQty, removeItem, onClose }) {
  // Example saved addresses (you can fetch from API/store)
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

