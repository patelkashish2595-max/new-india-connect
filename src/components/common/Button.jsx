
import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  type = "button",
  fullWidth = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary: {
      background: "linear-gradient(110deg, #C13584, #833AB4)",
      color: "#FFFFFF",
      border: "1px solid transparent",
    },
    secondary: {
      background: "#F4EAF8",
      color: "#833AB4",
      border: "1px solid transparent",
    },
    outline: {
      background: "#FFFFFF",
      color: "#C13584",
      border: "1px solid #C13584",
    },
    danger: {
      background: "#FEE2E2",
      color: "#B91C1C",
      border: "1px solid transparent",
    },
  };

  const sizes = {
    small: { padding: "7px 12px", fontSize: 13 },
    medium: { padding: "10px 18px", fontSize: 15 },
    large: { padding: "13px 22px", fontSize: 16 },
  };

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant] || variants.primary,
        ...sizes[size] || sizes.medium,
        width: fullWidth ? "100%" : "auto",
        minHeight: 40,
        borderRadius: 10,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.65 : 1,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        transition: "opacity 0.2s ease",
      }}
    >
      {loading && <LoaderCircle size={17} />}
      {children}
    </button>
  );
}
