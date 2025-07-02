import React, { useState, useEffect, useRef } from "react";
import { X, Search, Filter, ChevronDown } from "lucide-react";

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  loading,
  colors,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isMobile, setIsMobile] = useState(false);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      // Don't close if clicking inside the search bar container
      if (searchBarRef.current && searchBarRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on input or select elements (including their options)
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "OPTION" ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest('[role="combobox"]')
      ) {
        return;
      }

      // Additional check for browser-rendered select dropdowns
      const isSelectDropdown =
        target.closest("select") !== null ||
        target.matches("option") ||
        target.matches("optgroup") ||
        (target.parentElement && target.parentElement.matches("select"));

      if (isSelectDropdown) {
        return;
      }

      // Close the filters
      setShowFilters(false);
    };

    if (showFilters) {
      // Add event listener after a short delay to prevent immediate closure
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside, true);
        document.addEventListener("touchstart", handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside, true);
        document.removeEventListener("touchstart", handleClickOutside, true);
      };
    }
  }, [showFilters, setShowFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    onSearch(localQuery, filters);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);

    if (value.trim() === "") {
      setSearchQuery("");
      onSearch("", filters);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: "", minPrice: "", maxPrice: "" };
    setFilters(clearedFilters);
    onSearch(searchQuery, clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="w-full relative" ref={searchBarRef}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-stretch bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search
              size={isMobile ? 14 : 16}
              style={{ color: colors.mediumBlue }}
            />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder="Search medicines..."
            className="flex-1 pl-12 pr-4 py-4 md:py-3 text-base md:text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
            style={{
              color: colors.darkestBlue,
              minHeight: isMobile ? "56px" : "48px",
            }}
          />
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`relative px-3 md:px-4 py-2 border-l border-gray-200 transition-all duration-200 active:scale-95 ${
                showFilters
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              style={{
                minWidth: isMobile ? "56px" : "48px",
                minHeight: isMobile ? "56px" : "48px",
              }}
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
                minHeight: isMobile ? "48px" : "48px",
              }}
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

      {/* Filters Panel - Dropdown Overlay */}
      {showFilters && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 p-4 shadow-lg z-50"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="font-semibold text-base md:text-sm"
              style={{ color: colors.darkestBlue }}
            >
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
                className="p-1 hover:bg-gray-100 rounded-full"
                style={{ minWidth: "44px", minHeight: "44px" }}
              >
                <X size={18} style={{ color: colors.darkBlue }} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.darkBlue }}
              >
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange("category", e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
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
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.darkBlue }}
              >
                Min Price (₹)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="0"
                className="w-full p-3 md:p-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                style={{ minHeight: isMobile ? "48px" : "40px" }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.darkBlue }}
              >
                Max Price (₹)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
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
            Search results for:{" "}
            <span className="font-semibold">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setLocalQuery("");
              onSearch("", filters);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline self-start md:self-auto"
            style={{ minHeight: "44px" }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
