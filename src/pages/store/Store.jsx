import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3", 
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  showFilters, 
  setShowFilters, 
  filters, 
  setFilters, 
  loading 
}) => {
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
    <div className="w-full mb-6">
      {/* Enhanced Search Input with Mobile-First Design */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <div className="relative flex items-stretch bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search 
              size={isMobile ? 18 : 20} 
              style={{ color: colors.mediumBlue }} 
            />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder="Search medicines..."
            className="flex-1 pl-12 pr-4 py-4 md:py-3 text-base md:text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
            style={{ 
              color: colors.darkestBlue,
              minHeight: isMobile ? '56px' : '48px' // Ensures 56px touch target on mobile
            }}
          />

          {/* Mobile-Optimized Button Container */}
          <div className="flex items-stretch">
            {/* Filter Button - Enhanced for Mobile */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`
                relative px-3 md:px-4 py-2 border-l border-gray-200 
                transition-all duration-200 active:scale-95
                ${showFilters 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
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

            {/* Search Submit Button - Enhanced for Mobile */}
            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 md:px-5 py-2 text-white font-medium 
                transition-all duration-200 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300
              `}
              style={{ 
                backgroundColor: colors.darkBlue,
                minWidth: isMobile ? '80px' : '70px',
                minHeight: isMobile ? '56px' : '48px'
              }}
              aria-label="Search medicines"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <Search size={18} className="md:hidden" />
                  <span className="hidden md:inline">Search</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
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
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X size={18} style={{ color: colors.darkBlue }} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 md:p-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                  style={{ 
                    minHeight: isMobile ? '48px' : '40px'
                  }}
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

            {/* Price Range */}
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
                style={{ 
                  minHeight: isMobile ? '48px' : '40px'
                }}
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
                style={{ 
                  minHeight: isMobile ? '48px' : '40px'
                }}
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

export default SearchBar;
