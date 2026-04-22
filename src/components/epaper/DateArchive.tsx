"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toBengaliDigits } from "@/lib/bengali-date";

const bengaliMonths = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

interface DateArchiveProps {
  currentDate?: string;
}

export default function DateArchive({ currentDate }: DateArchiveProps) {
  const router = useRouter();
  const now = new Date();

  const [day, setDay] = useState(
    currentDate ? new Date(currentDate).getDate() : now.getDate()
  );
  const [month, setMonth] = useState(
    currentDate ? new Date(currentDate).getMonth() + 1 : now.getMonth() + 1
  );
  const [year, setYear] = useState(
    currentDate ? new Date(currentDate).getFullYear() : now.getFullYear()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    router.push(`/epaper?date=${dateStr}`);
  };

  // Generate year options (last 5 years)
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-sm mb-3 text-navy flex items-center gap-2">
        📰 পুরানো পত্রিকা
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Day */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">দিন</label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-red"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {toBengaliDigits(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">মাস</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-red"
            >
              {bengaliMonths.map((name, i) => (
                <option key={i} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">সাল</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-red"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {toBengaliDigits(y)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-red text-white py-2 rounded font-medium text-sm hover:bg-red-700 transition"
        >
          খুঁজুন
        </button>
      </form>
    </div>
  );
}
