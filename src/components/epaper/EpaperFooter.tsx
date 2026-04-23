import React from "react";
import Link from "next/link";

import SiteLogo from "@/components/ui/SiteLogo";
import { getSiteSettings } from "@/lib/payload-helpers";

const epaperLinks = [
  { href: "/epaper", label: "আজকের ই-পেপার" },
  { href: "/archive", label: "সংবাদ আর্কাইভ" },
  { href: "/", label: "অনলাইন পোর্টাল" },
];

export default async function EpaperFooter() {
  const settings = await getSiteSettings().catch(() => null);

  const phone = settings?.contactInfo?.phone || "+8801XXXXXXXXX";
  const email = settings?.contactInfo?.email || "info@dainiknewtimes.com";
  const footerText =
    settings?.footerText ||
    `স্বত্ব © ${new Date().getFullYear()} দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।`;

  return (
    <footer className="relative mt-10 overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,32,40,0.10),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(9,71,163,0.12),transparent_28%)]" />

      <div className="relative max-w-350 mx-auto px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href="/epaper" className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <SiteLogo className="w-35 sm:w-42.5" imageClassName="object-contain" />
                </Link>
                <div className="mt-4 inline-flex items-center rounded-full bg-primary-red/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary-red">
                  E-PAPER EDITION
                </div>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  দৈনিক নিউ টাইমসের মুদ্রিত সংস্করণ এখন অনলাইনে। পাতা উল্টে পড়ুন, নির্দিষ্ট সংবাদে যান, এবং দ্রুত মূল পোর্টালে ফিরে আসুন।
                </p>
              </div>

              <div className="text-sm text-slate-600">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">সাপোর্ট</p>
                <p className="mt-2 font-semibold text-slate-800">{phone}</p>
                <p className="break-all text-slate-600">{email}</p>
              </div>
            </div>
          </div>

          <div className="lg:pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">দ্রুত নেভিগেশন</p>
            <div className="mt-4 grid gap-3">
              {epaperLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between text-sm font-medium text-slate-800 transition hover:text-primary-red"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-400">+</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{footerText}</p>
          <p>ই-পেপার ও পোর্টাল অভিজ্ঞতা একই ব্র্যান্ডে সংযুক্ত।</p>
        </div>
      </div>
    </footer>
  );
}