import React from "react";
import { Search } from "lucide-react";
import MedicineCard from "./MedicineCard";
import { ShimmerCard } from "./ShimmerComponents";

export const MedicineGrid = ({
  loading,
  searchLoading,
  medicines,
  searchQuery,
  cart,
  addToCart,
  setSearchQuery,
  setFilters,
  loadMedicines,
  colors,
}) => {
  if (loading || searchLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(9)].map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Search size={64} className="mx-auto mb-4 opacity-30" />
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: colors.darkestBlue }}
        >
          No medicines found
        </h3>
        <p className="text-gray-500 mb-4">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "Try adjusting your search or filters"}
        </p>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilters({ category: "", minPrice: "", maxPrice: "" });
            loadMedicines();
          }}
          className="px-6 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.darkBlue }}
        >
          Show All Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {medicines.map((medicine) => {
        const cartItem = cart.find((i) => i.id === medicine.id);
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
  );
};
