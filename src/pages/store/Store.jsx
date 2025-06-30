import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart, History, X } from "lucide-react";
import { fetchMedicines } from "../../services/medicine";
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
/* 2. SHIMMER LOADING COMPONENTS */
const ShimmerCard = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const ShimmerCartItem = () => (
  <div className="bg-white p-3 rounded animate-pulse" style={{ borderLeft: `4px solid ${colors.mediumBlue}` }}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------- */
/* 3.  MAIN STORE PAGE  */
export default function StorePage() {
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [showCheckout, setShow] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* Fetch medicines on mount */
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const meds = await fetchMedicines({ limit: 1000 });
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

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  // Cart Component for reuse
  const CartContent = ({ className = "" }) => (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-lg md:text-xl font-semibold flex items-center"
          style={{ color: colors.darkestBlue }}
        >
          <ShoppingCart className="mr-2" size={isMobile ? 20 : 24} />
          Cart ({totalItems})
        </h2>
        {isMobile && (
          <button
            onClick={() => setShowMobileCart(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} style={{ color: colors.darkBlue }} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <ShimmerCartItem key={i} />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p style={{ color: colors.darkBlue }}>Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-1">Add some medicines to get started</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6 max-h-60 md:max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-sm border-l-4"
                style={{ borderLeftColor: colors.mediumBlue }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm md:text-base truncate"
                      style={{ color: colors.darkestBlue }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{item.price} × {item.qty} = ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-50 rounded ml-2"
                    style={{ color: colors.darkBlue }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => changeQty(item.id, -1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    style={{ backgroundColor: colors.lightBlue }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-medium min-w-[2rem] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    style={{ backgroundColor: colors.lightBlue }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-lg md:text-xl font-bold"
                style={{ color: colors.darkestBlue }}
              >
                Total: ₹{total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                setShow(true);
                if (isMobile) setShowMobileCart(false);
              }}
              className="w-full py-3 px-6 rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: colors.darkBlue }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  /* ----- render ----- */
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm border-b w-full">
        <div className="flex justify-between items-center p-4 w-full">
          <div className="flex-1">
            <h1
              className="text-xl font-bold"
              style={{ color: colors.darkestBlue }}
            >
              Pharmacy Store
            </h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${medicines.length} medicines available`}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/store/order-history')}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <History size={20} style={{ color: colors.darkBlue }} />
            </button>
            <button
              onClick={() => setShowMobileCart(true)}
              className="relative p-2 rounded-lg"
              style={{ backgroundColor: colors.darkBlue }}
            >
              <ShoppingCart size={20} color="white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full" style={{ minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r p-6 overflow-y-auto">
          <CartContent />
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 p-6 overflow-y-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.darkestBlue }}
              >
                Pharmacy Store
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? "Loading..." : `${medicines.length} medicines available`}
              </p>
            </div>
            <button
              onClick={() => navigate('/store/order-history')}
              className="flex items-center px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
              style={{ 
                backgroundColor: colors.darkBlue,
                color: 'white'
              }}
            >
              <History size={20} className="mr-2" />
              Order History
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine.id} product={medicine} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout - Full Width */}
      <div className="md:hidden w-full">
        <div className="p-4 pb-20 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[...Array(6)].map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine.id} product={medicine} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Fixed Cart Button */}
        {!showMobileCart && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowMobileCart(true)}
              className="relative p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: colors.darkBlue }}
            >
              <ShoppingCart size={24} color="white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cart Modal - Full Width */}
      {isMobile && showMobileCart && (
        <div className="fixed inset-0 z-50 md:hidden w-full h-full">
          <div className="absolute inset-0 bg-black bg-opacity-50 w-full h-full" onClick={() => setShowMobileCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-hidden w-full">
            <div className="p-4 max-h-full overflow-y-auto w-full">
              <CartContent />
            </div>
          </div>
        </div>
      )}

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
