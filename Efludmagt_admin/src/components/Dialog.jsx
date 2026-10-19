// components/Dialog.jsx
"use client";

import { useEffect, useRef } from "react";

export default function Dialog({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus the dialog
      if (dialogRef.current) {
        dialogRef.current.focus();
      }
    } else {
      document.removeEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="relative bg-white p-6"
        style={{
          width: "300px",
          height: "300px",
          background: "white",
          clipPath: "url(#inward-rounded)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1" // Make the div focusable
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          aria-label="Close dialog"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
