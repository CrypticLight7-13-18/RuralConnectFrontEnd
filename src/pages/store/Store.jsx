import React, { useState, useMemo } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';
import  CheckoutModal  from '../../components/Store/CheckoutModal';
import MedicineCard from '../../components/Store/MedicineCard';

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






