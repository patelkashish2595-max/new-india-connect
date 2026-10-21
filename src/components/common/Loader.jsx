
import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Loader({
  size = 36,
  text = "Loading...",
  fullScreen = false,
  color = "#C13584",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: fullScreen ? "100vh" : 120,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        background: fullScreen ? "#FFFFFF" : "transparent",
      }}
    >
      <LoaderCircle
        size={size}
        color={color}
        strokeWidth={2.5}
        style={{
          animation: "nic-spin 1s linear infinite",
        }}
      />

      {text && (
        <span style={{ color: "#777777", fontSize: 14 }}>
          {text}
        </span>
      )}

      <style>
        {`
          @keyframes nic-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .nic-loader {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
