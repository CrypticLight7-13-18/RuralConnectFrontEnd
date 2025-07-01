import React from "react";
import { History, ShoppingCart } from "lucide-react";

export const MobileHeader = ({
  navigate,
  totalItems,
  setShowMobileCart,
  colors,
  searchBar,
}) => (
  <div className="md:hidden flex-shrink-0 bg-white shadow-sm border-b w-full">
    <div className="flex items-center justify-between p-4 w-full gap-3">
      {/* Search Bar takes up most space */}
      <div className="flex-1 min-w-0">{searchBar}</div>

      {/* Action buttons */}
      <div className="flex space-x-2 flex-shrink-0">
        <button
          onClick={() => navigate("/store/order-history")}
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
);
