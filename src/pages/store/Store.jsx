import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  History,
  X,
  Search,
  Filter,
  ChevronDown
} from "lucide-react";
import { fetchMedicines, searchMedicines } from "../../services/medicine";
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
/* 3. SEARCH BAR COMPONENT */
const SearchBar = ({ searchQuery, setSearchQuery, onSearch, showFilters, setShowFilters, filters, setFilters, loading }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);
 
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    onSearch(localQuery, filters);
  };
 
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
   
    if (value.trim() === '') {
      setSearchQuery('');
      onSearch('', filters);
    }
  };
 
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };
 
  const clearFilters = () => {
    const clearedFilters = { category: '', minPrice: '', maxPrice: '' };
    setFilters(clearedFilters);
    onSearch(searchQuery, clearedFilters);
  };
 
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
 
  return (
    <div className="w-full">
      {/* Enhanced Search Input with Mobile-First Design */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-stretch bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search size={isMobile ? 14 : 16} style={{ color: colors.mediumBlue }} />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder="Search medicines..."
            className="flex-1 pl-12 pr-4 py-4 md:py-3 text-base md:text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
            style={{
              color: colors.darkestBlue,
              minHeight: isMobile ? '56px' : '48px'
            }}
          />
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-3 md:px-4 py-2 border-l border-gray-200 transition-all duration-200 active:scale-95 ${
                showFilters ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={{
                minWidth: isMobile ? '56px' : '48px',
                minHeight: isMobile ? '56px' : '48px'
              }}
              aria-label="Filter medicines"
            >
              <Filter size={isMobile ? 20 : 18} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
           <button
  type="submit"
  disabled={loading}
  className="flex items-center justify-center px-4 py-2 text-white font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300"
  style={{
    backgroundColor: colors.darkBlue,
    minWidth: isMobile ? "48px" : "48px",
    minHeight: isMobile ? "48px" : "48px"
  }}
  aria-label="Search medicines"
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <Search size={isMobile ? 20 : 20} />
  )}
</button>
 
          </div>
        </div>
      </form>
 
      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-base md:text-sm" style={{ color: colors.darkestBlue }}>
              Filter Medicines
            </h3>
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-full md:hidden"
                style={{ minWidth: "44px", minHeight: "44px" }}
              >
                <X size={18} style={{ color: colors.darkBlue }} />
              </button>
            </div>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 md:p-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                  style={{ minHeight: isMobile ? "48px" : "40px" }}
                >
                  <option value="">All Categories</option>
                  <option value="Analgesic">Analgesic</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Antihistamine">Antihistamine</option>
                  <option value="Antidiabetic">Antidiabetic</option>
                  <option value="Supplement">Supplement</option>
                  <option value="General">General</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{ color: colors.mediumBlue }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
                Min Price (₹)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full p-3 md:p-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                style={{ minHeight: isMobile ? "48px" : "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
                Max Price (₹)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="1000"
                className="w-full p-3 md:p-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                style={{ minHeight: isMobile ? "48px" : "40px" }}
              />
            </div>
          </div>
        </div>
      )}
 
      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
          <p className="text-sm" style={{ color: colors.darkBlue }}>
            Search results for: <span className="font-semibold">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLocalQuery('');
              onSearch('', filters);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline self-start md:self-auto"
            style={{ minHeight: '44px' }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
 
/* -------------------------------------------------- */
/* 4.  MAIN STORE PAGE  */
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
 
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
        category: m.category || 'General'
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
     
      if (!query && !Object.values(currentFilters).some(v => v !== '')) {
        await loadMedicines();
        return;
      }
 
      const searchParams = {};
      if (query) searchParams.q = query;
      if (currentFilters.category) searchParams.category = currentFilters.category;
      if (currentFilters.minPrice) searchParams.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) searchParams.maxPrice = currentFilters.maxPrice;
 
      const results = await searchMedicines(searchParams);
      const transformed = results.map((m) => ({
        id: m._id,
        name: m.name,
        price: m.price,
        description: m.shortDesc,
        img: Math.floor(Math.random() * 100) + 1,
        category: m.category || 'General'
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
 
  // Cart Component for reuse with independent scrolling
  const CartContent = ({ className = "" }) => (
    <div className={`${className} flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
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
 
      {loading && cart.length === 0 ? (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {[...Array(3)].map((_, i) => (
            <ShimmerCartItem key={i} />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-8 flex-1 flex flex-col justify-center">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p style={{ color: colors.darkBlue }}>Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-1">Add some medicines to get started</p>
        </div>
      ) : (
        <>
          {/* Scrollable Cart Items Area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 min-h-0">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-sm border-l-4 flex-shrink-0"
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
 
          {/* Fixed Checkout Section */}
          <div className="border-t pt-4 flex-shrink-0">
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
      className="h-[88vh] w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      {/* Mobile Header */}
      <div className="md:hidden flex-shrink-0 bg-white shadow-sm border-b w-full">
        <div className="flex justify-between items-center p-4 w-full">
          <div className="flex-1">
            <h1
              className="text-xl font-bold"
              style={{ color: colors.darkestBlue }}
            >
              Pharmacy Store
            </h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${medicines.length} medicines found`}
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
      <div className="hidden md:flex w-full flex-1 min-h-0">
        {/* Desktop Sidebar with Independent Scroll */}
        <div className="w-80 bg-white shadow-lg border-r flex flex-col">
          <div className="p-6 h-full flex flex-col min-h-0">
            <CartContent />
          </div>
        </div>
 
        {/* Desktop Main Content with Independent Scroll */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Fixed Header Area */}
          <div className="flex-shrink-0 p-4 bg-white border-b">
            <div className="flex justify-between items-center mb-1 ">
              
               <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              setFilters={setFilters}
              loading={searchLoading}
            />
              <button
                onClick={() => navigate('/store/order-history')}
                className="flex items-center ml-1 px-4 py-2 rounded-lg font-medium text-xs hover:opacity-90 transition-all"
                style={{
                  backgroundColor: colors.darkBlue,
                  color: 'white'
                }}
              >
                <History size={20} className="mr-2" />
                Order History
              </button>
            </div>
 
            {/* Search Bar - Fixed in Header */}
           
          </div>
 
          {/* Scrollable Medicine Grid Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {loading || searchLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <ShimmerCard key={i} />
                ))}
              </div>
            ) : medicines.length === 0 ? (
              <div className="text-center py-12">
                <Search size={64} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.darkestBlue }}>
                  No medicines found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your search or filters"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ category: '', minPrice: '', maxPrice: '' });
                    loadMedicines();
                  }}
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.darkBlue }}
                >
                  Show All Medicines
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {medicines.map((medicine) => {
                  const cartItem = cart.find(i => i.id === medicine.id);
                  const qty = cartItem ? cartItem.qty : 0;
                  return (
                    <MedicineCard
                      key={medicine.id}
                      product={medicine}
                      quantity={qty}
                      onAdd={addToCart}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Mobile Layout - Full Width */}
      <div className="md:hidden flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Search Bar - Mobile */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            loading={searchLoading}
          />
 
          {/* Medicine Grid - Mobile */}
          {loading || searchLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[...Array(6)].map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.darkestBlue }}>
                No medicines found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your search or filters"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ category: '', minPrice: '', maxPrice: '' });
                  loadMedicines();
                }}
                className="px-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: colors.darkBlue }}
              >
                Show All Medicines
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pb-20">
              {medicines.map((medicine) => {
                const cartItem = cart.find(i => i.id === medicine.id);
                const qty = cartItem ? cartItem.qty : 0;
                return (
                  <MedicineCard
                    key={medicine.id}
                    product={medicine}
                    quantity={qty}
                    onAdd={addToCart}
                  />
                );
              })}
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
 
      {/* Mobile Cart Modal with Independent Scroll */}
      {isMobile && showMobileCart && (
        <div className="fixed inset-0 z-50 md:hidden w-full h-full">
          <div className="absolute inset-0 bg-black bg-opacity-50 w-full h-full" onClick={() => setShowMobileCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-hidden w-full flex flex-col">
            <div className="p-4 h-full flex flex-col min-h-0">
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