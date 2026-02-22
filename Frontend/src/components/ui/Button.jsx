import React, { useState } from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
  style = {},
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  /* ================= Base ================= */
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    fontWeight: 600,
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    outline: "none",
    border: "none",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.7 : 1,
  };

  /* ================= Variants ================= */
  const variants = {
    primary: {
      backgroundColor: disabled
        ? "#cbd5e1"
        : hover
        ? "#2563eb"
        : "#3b82f6",
      color: "#ffffff",
      boxShadow: disabled
        ? "none"
        : "0 4px 14px rgba(59,130,246,0.25)",
    },

    secondary: {
      backgroundColor: disabled
        ? "#f1f5f9"
        : hover
        ? "#f8fafc"
        : "#ffffff",
      color: disabled ? "#94a3b8" : "#334155",
      border: "1px solid #e2e8f0",
    },

    danger: {
      backgroundColor: disabled
        ? "#fecaca"
        : hover
        ? "#dc2626"
        : "#ef4444",
      color: "#ffffff",
      boxShadow: disabled
        ? "none"
        : "0 4px 14px rgba(239,68,68,0.25)",
    },

    ghost: {
      backgroundColor: "transparent",
      color: disabled ? "#94a3b8" : hover ? "#0f172a" : "#64748b",
    },
  };

  /* ================= Sizes ================= */
  const sizes = {
    small: {
      padding: "6px 12px",
      fontSize: "13px",
    },
    medium: {
      padding: "8px 18px",
      fontSize: "14px",
    },
    large: {
      padding: "12px 24px",
      fontSize: "15px",
    },
  };

  /* Safe fallback */
  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.medium;

  const finalStyles = {
    ...baseStyles,
    ...selectedSize,
    ...selectedVariant,
    transform: active && !disabled ? "scale(0.97)" : "scale(1)",
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={finalStyles}
      className={className}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;