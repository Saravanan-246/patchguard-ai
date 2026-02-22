import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
  style = {},
  ...props
}) => {
  /* ================= Lock Scroll + ESC ================= */
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ================= Sizes ================= */
  const modalSizes = {
    small: { maxWidth: "420px", width: "90%" },
    medium: { maxWidth: "600px", width: "90%" },
    large: { maxWidth: "820px", width: "90%" },
    fullscreen: {
      width: "95vw",
      height: "95vh",
    },
  };

  const selectedSize = modalSizes[size] || modalSizes.medium;

  /* ================= Styles ================= */
  const backdropStyles = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.15s ease",
  };

  const modalStyles = {
    ...selectedSize,
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "scaleIn 0.15s ease",
    ...style,
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 24px 16px",
    borderBottom: "1px solid #f1f5f9",
  };

  const titleStyles = {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
  };

  const closeButtonStyles = {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    color: "#64748b",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "4px 8px",
    transition: "all 0.15s ease",
  };

  const contentStyles = {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  };

  /* ================= Backdrop Click ================= */
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div style={backdropStyles} onClick={handleBackdropClick}>
      <div style={modalStyles} className={className} {...props}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                onClick={onClose}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f1f5f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                ×
              </button>
            )}
          </div>
        )}

        <div style={contentStyles}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;