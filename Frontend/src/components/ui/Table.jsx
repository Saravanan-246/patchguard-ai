import React, { useState } from "react";

/* =========================
   Table Wrapper
========================= */
const Table = ({
  children,
  className = "",
  responsive = false,
  bordered = false,
  ...props
}) => {
  const containerStyles = {
    overflowX: responsive ? "auto" : "visible",
    borderRadius: "12px",
    border: bordered ? "1px solid #e2e8f0" : "none",
    background: "#ffffff",
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",
    minWidth: responsive ? "640px" : "auto",
  };

  return (
    <div style={containerStyles} className={className}>
      <table style={tableStyles} {...props}>
        {children}
      </table>
    </div>
  );
};

/* =========================
   Header
========================= */
const TableHeader = ({ children, ...props }) => (
  <thead
    style={{
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    }}
    {...props}
  >
    {children}
  </thead>
);

/* =========================
   Body
========================= */
const TableBody = ({ children, striped = false, ...props }) => {
  return (
    <tbody {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === TableRow) {
          return React.cloneElement(child, {
            striped: striped && index % 2 !== 0,
          });
        }
        return child;
      })}
    </tbody>
  );
};

/* =========================
   Row
========================= */
const TableRow = ({
  children,
  striped = false,
  hover = true,
  ...props
}) => {
  const [isHover, setIsHover] = useState(false);

  const styles = {
    borderBottom: "1px solid #f1f5f9",
    background: striped
      ? "#f8fafc"
      : isHover && hover
      ? "#f1f5f9"
      : "transparent",
    transition: "background 0.15s ease",
  };

  return (
    <tr
      style={styles}
      onMouseEnter={() => hover && setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      {children}
    </tr>
  );
};

/* =========================
   Cell
========================= */
const TableCell = ({
  children,
  align = "left",
  padding = "medium",
  ...props
}) => {
  const paddingMap = {
    none: "0",
    small: "8px 12px",
    medium: "12px 16px",
    large: "16px 20px",
  };

  return (
    <td
      style={{
        padding: paddingMap[padding] || paddingMap.medium,
        textAlign: align,
        color: "#334155",
      }}
      {...props}
    >
      {children}
    </td>
  );
};

/* =========================
   Header Cell
========================= */
const TableHeaderCell = ({
  children,
  align = "left",
  sortable = false,
  onSort,
  sortDirection = null,
  ...props
}) => {
  const handleClick = () => {
    if (sortable && onSort) onSort();
  };

  const sortIcon =
    sortDirection === "asc"
      ? "↑"
      : sortDirection === "desc"
      ? "↓"
      : "↕";

  return (
    <th
      onClick={handleClick}
      style={{
        padding: "12px 16px",
        textAlign: align,
        fontWeight: 600,
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#475569",
        cursor: sortable ? "pointer" : "default",
        userSelect: "none",
      }}
      {...props}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            align === "right"
              ? "flex-end"
              : align === "center"
              ? "center"
              : "flex-start",
          gap: "6px",
        }}
      >
        {children}
        {sortable && (
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            {sortIcon}
          </span>
        )}
      </span>
    </th>
  );
};

/* =========================
   Export Structure
========================= */
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

export default Table;