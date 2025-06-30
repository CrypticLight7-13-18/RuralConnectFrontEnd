import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart, History } from "lucide-react";
// Using simple alert for notifications. Feel free to swap with toast library.
import { fetchMedicines } from "../../services/medicine";
// import { createOrder } from "../../services/order";
// import { fetchUserProfile } from "../../services/auth";
import CheckoutModal from "../../components/Store/CheckoutModal";
import MedicineCard from "../../components/Store/MedicineCard";

/* -------------------------------------------------- */
/* 1.  THEME  */
const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

/* -------------------------------------------------- */
/* 2.  Medicines fetched from backend */

/* -------------------------------------------------- */
/* 4.  MAIN STORE PAGE  */
export default function StorePage() {
  const navigate = useNavigate();
  
  /* cart = { id, name, price, qty }[] */
  const [cart, setCart] = useState([]);
  const [showCheckout, setShow] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [, setLoading] = useState(true);

  /* Fetch medicines on mount */
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const meds = await fetchMedicines({ limit: 1000 });
        // Transform medicines to expected shape for UI
        const transformed = meds.map((m) => ({
          id: m._id,
          name: m.name,
          price: m.price,
          description: m.shortDesc,
          img: Math.floor(Math.random() * 100) + 1,
        }));
        setMedicines(transformed);
      } catch (err) {
        console.error("Failed to load medicines", err);
      } finally {
        setLoading(false);
      }
    };
    loadMedicines();
  }, []);

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

  /* Create order handler passed to CheckoutModal */
  // const handlePlaceOrder = async (address, paymentMethod) => {
  //   try {
  //     // 1. Get user profile to obtain ID
  //     const user = await fetchUserProfile();
  //     // 2. Build order items list
  //     const orderItems = cart.map((item) => ({
  //       medicineId: item.id,
  //       quantity: item.qty,
  //     }));

  //     const orderPayload = {
  //       customerId: user._id,
  //       orderItems,
  //       shippingAddress: address,
  //       // Let backend compute total and delivery date
  //     };

  //     await createOrder(orderPayload);
  //     // Reset cart after success
  //     setCart([]);
  //     setShow(false);
  //     alert("Order placed successfully");
  //   } catch (err) {
  //     console.error("Order creation failed", err);
  //     alert(err.response?.data?.message || "Failed to place order");
  //   }
  // };

  /* ----- render ----- */
  return (
    <div
      className="flex overflow-clip"
      style={{ background: colors.lightestBlue, height: "92vh" }}
    >
      {/* Cart Sidebar */}
      <div className="w-full sm:w-80 p-6 bg-white shadow-md overflow-y-scroll sticky top-0 h-full">
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

            <div className="flex justify-between items-center">
              <span
                className="font-bold text-lg"
                style={{ color: colors.darkestBlue }}
              >
                Total: ₹{total.toFixed(2)}
              </span>
              <button
                onClick={() => setShow(true)}
                className="px-4 py-2 rounded text-white"
                style={{ background: colors.darkBlue }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Product List */}
      <div className="flex-1 h-full p-6 overflow-y-scroll">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.darkestBlue }}
          >
            Pharmacy Store
          </h1>
          <button
            onClick={() => navigate('/store/order-history')}
            className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: colors.darkBlue,
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.darkestBlue}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.darkBlue}
          >
            <History size={18} className="mr-2" />
            Order History
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((m) => (
            <MedicineCard key={m.id} product={m} onAdd={addToCart} />
          ))}
        </div>
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
