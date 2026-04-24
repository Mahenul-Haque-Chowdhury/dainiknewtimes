import React from "react";
import Link from "next/link";

import SiteLogo from "@/components/ui/SiteLogo";
import { getSiteSettings } from "@/lib/payload-helpers";

const epaperLinks = [
  { href: "/epaper", label: "আজকের ই-পেপার" },
  { href: "/archive", label: "সংবাদ আর্কাইভ" },
  { href: "/", label: "অনলাইন পোর্টাল" },
];

type SocialLink = {
  label: string;
  href?: string | null;
  icon: React.ReactNode;
};

export default async function EpaperFooter() {
  const settings = await getSiteSettings().catch(() => null);

  const phone = settings?.contactInfo?.phone || "+8801XXXXXXXXX";
  const email = settings?.contactInfo?.email || "info@dainiknewtimes.com";
  const footerText = "স্বত্ব © ২০২৬ দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।";

  const socialLinks: SocialLink[] = [
    {
      label: "Facebook",
      href: settings?.socialLinks?.facebook,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M13.5 21v-7h2.35l.4-3h-2.75V9.28c0-.87.25-1.46 1.5-1.46H16.4V5.14c-.24-.03-1.08-.1-2.06-.1-2.04 0-3.44 1.24-3.44 3.52V11H8.6v3h2.3v7h2.6Z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: settings?.socialLinks?.twitter,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M18.9 3H21l-4.58 5.24L21.8 21h-4.22l-3.3-4.85L10.02 21H7.9l4.9-5.6L2.2 3h4.33l2.98 4.39L13.35 3h2.12l-4.98 5.69 3.79 5.58L18.9 3Zm-1.48 16h1.17L7.92 4.9H6.66L17.42 19Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: settings?.socialLinks?.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm15.19 9.86c0-3.52-1.88-5.16-4.4-5.16-2.03 0-2.94 1.12-3.45 1.9V8.5H9.21c.04.73 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.68.9-1.38 1.95-1.38 1.38 0 1.93 1.04 1.93 2.56V20H20v-6.76Z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative mt-10 overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,32,40,0.10),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(9,71,163,0.12),transparent_28%)]" />

      <div className="relative max-w-350 mx-auto px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-6 px-1 py-1">
          <div className="text-base font-semibold leading-8 text-slate-800 sm:text-lg lg:text-xl lg:leading-9">
            <p className="lg:hidden">ভারপ্রাপ্ত সম্পাদক: সাইফুল ইসলাম</p>
            <p className="lg:hidden">প্রকাশক ও সম্পাদক: এম. এ মতিন</p>
            <p className="hidden lg:block">ভারপ্রাপ্ত সম্পাদক: সাইফুল ইসলাম || প্রকাশক ও সম্পাদক: এম. এ মতিন</p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-primary-red/30 hover:text-primary-red hover:shadow-sm"
                  >
                    <span className="text-primary-red">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
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
          </div>

          <div className="lg:pt-1 lg:pl-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10 lg:gap-12">
              <div className="text-sm text-slate-600">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">সাপোর্ট</p>
                <p className="mt-2 font-semibold text-slate-800">{phone}</p>
                <p className="break-all text-slate-600">{email}</p>
              </div>

              <div>
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
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 pt-4 text-xs text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-700">আমাদের সঙ্গে থাকুন</p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={`footer-${item.label}`}
                    href={item.href || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-primary-red/30 hover:text-primary-red hover:shadow-sm"
                  >
                    <span className="text-primary-red">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>{footerText}</p>
            <p>
              কারিগরি সহযোগিতায় {" "}
              <a
                href="https://grayvally.tech"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-700 transition hover:text-primary-red"
              >
                Grayvally
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}