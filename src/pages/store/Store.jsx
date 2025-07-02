import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, History } from "lucide-react";
import { fetchMedicines, searchMedicines } from "../../services/medicine";
import CheckoutModal from "../../components/Store/CheckoutModal";
import { SearchBar } from "../../components/Store/SearchBar";
import { CartContent } from "../../components/Store/CartContent";
import { MobileHeader } from "../../components/Store/MobileHeader";
import { MedicineGrid } from "../../components/Store/MedicineGrid";
import { colors } from "../../utils/colors";
 
 
/* -------------------------------------------------- */
/* 2.  MAIN STORE PAGE  */
export default function StorePage() {
  const navigate = useNavigate();
 
  const [cart, setCart] = useState([]);
  const [showCheckout, setShow] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 
  // Search related state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });
 
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
 
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  /* Fetch medicines on mount */
  useEffect(() => {
    loadMedicines();
  }, []);
 
  const loadMedicines = async () => {
    try {
      setLoading(true);
      const meds = await fetchMedicines({ limit: 1000 });
      const transformed = meds.map((m) => ({
        id: m._id,
        name: m.name,
        price: m.price,
        description: m.shortDesc,
        img: Math.floor(Math.random() * 100) + 1,
        category: m.category || "General",
      }));
      setMedicines(transformed);
    } catch (err) {
      console.error("Failed to load medicines", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSearch = async (query, currentFilters) => {
    try {
      setSearchLoading(true);
 
      if (!query && !Object.values(currentFilters).some((v) => v !== "")) {
        await loadMedicines();
        return;
      }
 
      const searchParams = {};
      if (query) searchParams.q = query;
      if (currentFilters.category)
        searchParams.category = currentFilters.category;
      if (currentFilters.minPrice)
        searchParams.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice)
        searchParams.maxPrice = currentFilters.maxPrice;
 
      const results = await searchMedicines(searchParams);
      const transformed = results.map((m) => ({
        id: m._id,
        name: m.name,
        price: m.price,
        description: m.shortDesc,
        img: Math.floor(Math.random() * 100) + 1,
        category: m.category || "General",
      }));
      setMedicines(transformed);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearchLoading(false);
    }
  };
 
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
 
  /* ----- render ----- */
  return (
    <div
      className="h-[88vh] w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      {/* Mobile Header */}
      <MobileHeader
        navigate={navigate}
        totalItems={totalItems}
        setShowMobileCart={setShowMobileCart}
        colors={colors}
        searchBar={
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            loading={searchLoading}
            colors={colors}
          />
        }
      />
 
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r flex flex-col">
          <div className="p-6 h-full flex flex-col min-h-0">
            <CartContent
              cart={cart}
              totalItems={totalItems}
              loading={loading}
              isMobile={isMobile}
              total={total}
              changeQty={changeQty}
              removeItem={removeItem}
              setShowMobileCart={setShowMobileCart}
              setShow={setShow}
              colors={colors}
            />
          </div>
        </div>
 
        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Fixed Header Area */}
          <div className="flex-shrink-0 p-4 bg-white border-b">
            <div className="flex justify-between items-center mb-1">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                setFilters={setFilters}
                loading={searchLoading}
                colors={colors}
              />
              <button
                onClick={() => navigate("/store/order-history")}
                className="flex items-center ml-1 px-4 py-2 rounded-lg font-medium text-xs hover:opacity-90 transition-all"
                style={{
                  backgroundColor: colors.darkBlue,
                  color: "white",
                }}
              >
                <History size={20} className="mr-2" />
                Order History
              </button>
            </div>
          </div>
 
          {/* Scrollable Medicine Grid Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            <MedicineGrid
              loading={loading}
              searchLoading={searchLoading}
              medicines={medicines}
              searchQuery={searchQuery}
              cart={cart}
              addToCart={addToCart}
              setSearchQuery={setSearchQuery}
              setFilters={setFilters}
              loadMedicines={loadMedicines}
              colors={colors}
            />
          </div>
        </div>
      </div>
 
      {/* Mobile Layout */}
      <div className="md:hidden flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="pb-20">
            <MedicineGrid
              loading={loading}
              searchLoading={searchLoading}
              medicines={medicines}
              searchQuery={searchQuery}
              cart={cart}
              addToCart={addToCart}
              setSearchQuery={setSearchQuery}
              setFilters={setFilters}
              loadMedicines={loadMedicines}
              colors={colors}
            />
          </div>
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
 
      {/* Mobile Cart Modal */}
      {isMobile && showMobileCart && (
        <div className="fixed inset-0 z-50 md:hidden w-full h-full">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 w-full h-full"
            onClick={() => setShowMobileCart(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-hidden w-full flex flex-col">
            <div className="p-4 h-full flex flex-col min-h-0">
              <CartContent
                cart={cart}
                totalItems={totalItems}
                loading={loading}
                isMobile={isMobile}
                total={total}
                changeQty={changeQty}
                removeItem={removeItem}
                setShowMobileCart={setShowMobileCart}
                setShow={setShow}
                colors={colors}
              />
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