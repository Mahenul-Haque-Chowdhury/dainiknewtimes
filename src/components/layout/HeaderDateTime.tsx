"use client";

import React, { useEffect, useState } from "react";

import { getFormattedBengaliDate } from "@/lib/bengali-date";

export default function HeaderDateTime() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    setDateTime(getFormattedBengaliDate());

    const interval = setInterval(() => {
      setDateTime(getFormattedBengaliDate());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return <span className="truncate">{dateTime}</span>;
}
