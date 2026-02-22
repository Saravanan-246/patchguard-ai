import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "medium",
  outline = false,
  className = "",
  style = {},
  ...props
}) => {
  /* ================= Base ================= */
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
    letterSpacing: "0.2px",
  };

  /* ================= Variants ================= */
  const variants = {
    default: {
      backgroundColor: "#f1f5f9",
      color: "#334155",
    },
    success: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    warning: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    danger: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
    },
    info: {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
    },
    primary: {
      backgroundColor: "#e0e7ff",
      color: "#3730a3",
    },
  };

  /* ================= Sizes ================= */
  const sizes = {
    small: {
      padding: "2px 8px",
      fontSize: "11px",
      borderRadius: "999px",
    },
    medium: {
      padding: "4px 12px",
      fontSize: "12px",
      borderRadius: "999px",
    },
    large: {
      padding: "6px 16px",
      fontSize: "14px",
      borderRadius: "999px",
    },
  };

  /* Safe fallback */
  const selectedVariant = variants[variant] || variants.default;
  const selectedSize = sizes[size] || sizes.medium;

  const finalStyles = {
    ...baseStyles,
    ...selectedSize,
    ...(outline
      ? {
          backgroundColor: "transparent",
          border: `1px solid ${selectedVariant.color}`,
          color: selectedVariant.color,
        }
      : selectedVariant),
    ...style,
  };

  return (
    <span style={finalStyles} className={className} {...props}>
      {children}
    </span>
  );
};

export default Badge;