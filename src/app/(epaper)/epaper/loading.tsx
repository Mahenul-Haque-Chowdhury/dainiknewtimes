import React from "react";

export default function EpaperLoading() {
  return (
    <div className="max-w-300 mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-[70vh] w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}

