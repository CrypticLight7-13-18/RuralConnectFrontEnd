import React from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { ShimmerCartItem } from "./ShimmerComponents";

export const CartContent = ({
  cart,
  totalItems,
  loading,
  isMobile,
  total,
  changeQty,
  removeItem,
  setShowMobileCart,
  setShow,
  colors,
}) => (
  <div className="flex flex-col h-full">
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
          <ShimmerCartItem key={i} colors={colors} />
        ))}
      </div>
    ) : cart.length === 0 ? (
      <div className="text-center py-8 flex-1 flex flex-col justify-center">
        <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
        <p style={{ color: colors.darkBlue }}>Your cart is empty</p>
        <p className="text-sm text-gray-500 mt-1">
          Add some medicines to get started
        </p>
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
                    ₹{item.price} × {item.qty} = ₹
                    {(item.price * item.qty).toFixed(2)}
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
