import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import "../globals.css";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bengali",
});

export default function EpaperRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${notoBengali.variable} font-bengali antialiased`}>{children}</body>
    </html>
  );
}
