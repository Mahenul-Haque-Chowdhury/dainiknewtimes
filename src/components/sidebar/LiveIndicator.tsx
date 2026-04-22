import React from "react";

export default function LiveIndicator() {
  return (
    <div className="bg-navy text-white p-3 rounded">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full live-pulse" />
        <span className="font-bold text-sm">লাইভ</span>
      </div>
    </div>
  );
}
