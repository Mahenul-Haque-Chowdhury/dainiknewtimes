import React from "react";

export default function FrontendLoading() {
  return (
    <div className="max-w-300 mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-56 w-full bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

