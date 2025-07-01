import React from "react";
import { Plus } from "lucide-react";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function MedicineCard({ product, onAdd, quantity = 0 }) {
  function imagegen(id) {
    const clampedId = Math.max(1, Math.min(id, 100));
    const paddedIndex = String(clampedId).padStart(3, "0");
    return `/Picture/generated_images/image${paddedIndex}.svg`;
  }

  return (
    <div
      className="flex flex-col rounded-lg shadow hover:shadow-lg transition overflow-hidden"
      style={{ border: `2px solid ${colors.lightBlue}`, background: "white" }}
    >
      <img
        src={imagegen(product.img)}
        alt={product.name}
        className="h-40 object-cover w-full"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold mb-1"
          style={{ color: colors.darkestBlue }}
        >
          {product.name}
        </h3>
        <p className="text-xs mb-2" style={{ color: colors.darkBlue }}>
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold" style={{ color: colors.darkBlue }}>
            ₹{product.price}
          </span>
          <button
            onClick={() => onAdd(product)}
            className="px-3 py-1 rounded-full text-sm flex items-center space-x-1"
            style={{ background: colors.darkBlue, color: "white" }}
          >
            <Plus size={14} />
            <span>{quantity > 0 ? `Qty: ${quantity}` : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
);
}
