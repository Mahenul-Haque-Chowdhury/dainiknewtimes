"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-gray-600 hover:text-navy transition"
    >
      🖨️ প্রিন্ট
    </button>
  );
}
