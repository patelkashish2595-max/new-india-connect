
import React from "react";

export default function Avatar({
  src,
  name = "User",
  color = "#C13584",
  size = "medium",
  online = false,
  onClick,
}) {
  const sizes = {
    small: 30,
    medium: 42,
    large: 88,
    story: 58,
  };

  const dimension = sizes[size] || sizes.medium;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${name} profile`}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        padding: 0,
        border: size === "story" ? "3px solid #C13584" : "none",
        borderRadius: "50%",
        background: color,
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        color: "white",
        fontSize: dimension * 0.4,
        fontWeight: 700,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
          }}
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}

      {online && (
        <span
          style={{
            position: "absolute",
            right: 1,
            bottom: 1,
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: "#22C55E",
            border: "2px solid white",
          }}
        />
      )}
    </button>
  );
}
