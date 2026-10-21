
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen = false,
  onClose,
  title = "",
  children,
  width = 480,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(20, 10, 25, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "85vh",
          overflowY: "auto",
          background: "#FFFFFF",
          borderRadius: 18,
          boxShadow: "0 20px 70px rgba(0,0,0,0.2)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #EEEEEE",
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0 }}>{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              border: 0,
              borderRadius: "50%",
              background: "#F5F5F5",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </header>

        <div style={{ padding: 20 }}>{children}</div>
      </section>
    </div>
  );
}
