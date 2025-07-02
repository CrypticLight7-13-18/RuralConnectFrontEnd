import React from "react";
import clsx from "clsx";
import { colors } from "../../utils/colors";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  ...props
}) {
  const variants = {
    primary: {
      base: `bg-[${colors.darkBlue}] text-white`,
      hover: `hover:bg-[${colors.darkestBlue}]`,
      disabled: "opacity-50 cursor-not-allowed",
    },
    secondary: {
      base: `bg-[${colors.mediumBlue}] text-[${colors.darkestBlue}]`,
      hover: `hover:bg-[${colors.darkBlue}] hover:text-white`,
      disabled: "opacity-50 cursor-not-allowed",
    },
    ghost: {
      base: `bg-transparent border border-[${colors.darkBlue}] text-[${colors.darkestBlue}]`,
      hover: `hover:bg-[${colors.lightBlue}]`,
      disabled: "opacity-50 cursor-not-allowed",
    },
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2",
        v.base,
        v.hover,
        disabled && v.disabled,
        s,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
