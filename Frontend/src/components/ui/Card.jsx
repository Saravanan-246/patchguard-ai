import React from "react";

/* =========================
   Card Container
========================= */
const Card = ({
  children,
  className = "",
  padding = "medium",
  shadow = true,
  border = true,
  hover = false,
  style = {},
  ...props
}) => {
  const baseStyles = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    transition: "all 0.2s ease",
  };

  const paddingStyles = {
    none: { padding: "0" },
    small: { padding: "16px" },
    medium: { padding: "24px" },
    large: { padding: "32px" },
  };

  const shadowStyles = shadow
    ? {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }
    : {};

  const borderStyles = border
    ? {
        border: "1px solid #f1f5f9",
      }
    : {};

  const hoverStyles = hover
    ? {
        cursor: "pointer",
      }
    : {};

  const finalStyles = {
    ...baseStyles,
    ...(paddingStyles[padding] || paddingStyles.medium),
    ...shadowStyles,
    ...borderStyles,
    ...hoverStyles,
    ...style,
  };

  return (
    <div
      style={finalStyles}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/* =========================
   Card Header
========================= */
const CardHeader = ({ children, className = "", style = {}, ...props }) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: "1px solid #f1f5f9",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/* =========================
   Card Title
========================= */
const CardTitle = ({
  children,
  className = "",
  size = "medium",
  style = {},
  ...props
}) => {
  const sizes = {
    small: { fontSize: "16px" },
    medium: { fontSize: "18px" },
    large: { fontSize: "20px" },
  };

  return (
    <h3
      style={{
        margin: 0,
        fontWeight: 600,
        color: "#0f172a",
        letterSpacing: "0.2px",
        ...(sizes[size] || sizes.medium),
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </h3>
  );
};

/* =========================
   Card Content
========================= */
const CardContent = ({
  children,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div
      style={{
        color: "#475569",
        fontSize: "14px",
        lineHeight: "1.6",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/* =========================
   Export Structure
========================= */

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;

export default Card;