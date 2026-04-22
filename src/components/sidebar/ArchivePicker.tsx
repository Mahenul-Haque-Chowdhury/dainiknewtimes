"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArchivePicker() {
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      router.push(`/archive?date=${date}`);
    }
  };

  return (
    <div className="border rounded overflow-hidden">
      <div className="bg-primary-red text-white px-3 py-2 font-bold text-sm">
        আর্কাইভ
      </div>
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm flex-1 focus:outline-none focus:border-primary-blue"
          />
          <button
            type="submit"
            className="bg-primary-red text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-red-700 transition"
          >
            খুঁজুন
          </button>
        </div>
      </form>
    </div>
  );
}
