import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-8911175089831107";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bengali",
});

export const metadata = {
  title: "ই-পেপার | দৈনিক নিউ টাইমস",
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
  icons: {
    icon: [
      { url: "/images/dainiknewtimes-logo.png", type: "image/png" },
    ],
    shortcut: "/images/dainiknewtimes-logo.png",
    apple: "/images/dainiknewtimes-logo.png",
  },
};

export default function EpaperRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
      </head>
      <body className={`${notoBengali.variable} font-bengali antialiased`}>
        {ADSENSE_CLIENT && (
          <Script
            id="adsense-loader-epaper"
            async
            strategy="beforeInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        {children}
      </body>
    </html>
  );
}
