import React from "react";
import Link from "next/link";

import SiteLogo from "@/components/ui/SiteLogo";
import { getSiteSettings } from "@/lib/payload-helpers";

const primaryLinks = [
  { href: "/", label: "প্রধান পাতা" },
  { href: "/archive", label: "আর্কাইভ" },
  { href: "/search", label: "সংবাদ খুঁজুন" },
  { href: "/epaper", label: "ই-পেপার" },
];

type SocialLink = {
  label: string;
  href?: string | null;
};

export default async function Footer() {
  const settings = await getSiteSettings().catch(() => null);

  const siteName = settings?.siteName || "দৈনিক নিউ টাইমস";
  const tagline = settings?.tagline || "সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি";
  const publisherInfo = settings?.editorInfo?.publisherInfo || "সম্পাদক কর্তৃক প্রকাশিত।";

  const phone = settings?.contactInfo?.phone || "+8801XXXXXXXXX";
  const email = settings?.contactInfo?.email || "info@dainiknewtimes.com";
  const address = settings?.contactInfo?.address || "Dhaka, Bangladesh";

  const footerText =
    settings?.footerText ||
    `স্বত্ব © ${new Date().getFullYear()} দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।`;

  const socialLinks: SocialLink[] = [
    { label: "Facebook", href: settings?.socialLinks?.facebook },
    { label: "YouTube", href: settings?.socialLinks?.youtube },
    { label: "X", href: settings?.socialLinks?.twitter },
    { label: "Instagram", href: settings?.socialLinks?.instagram },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,32,40,0.10),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(13,110,253,0.12),transparent_30%)]" />

      <div className="relative max-w-300 mx-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">
          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <Link href="/" className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
                  <SiteLogo className="w-30 sm:w-40" imageClassName="object-contain" />
                </Link>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">News Portal</p>
                <h2 className="mt-2 text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">{siteName}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{tagline}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-90 lg:grid-cols-1">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">ভারপ্রাপ্ত সম্পাদক</p>
                  <p className="mt-1.5 text-base font-bold text-slate-900">সাইফুল ইসলাম</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">প্রকাশক ও সম্পাদক</p>
                  <p className="mt-1.5 text-base font-bold text-slate-900">এম. এ মতিন</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 pt-4 md:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">প্রকাশনা</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{publisherInfo}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">যোগাযোগ</p>
                <div className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                  <p>{phone}</p>
                  <p className="break-all">{email}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">অফিস</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 whitespace-pre-line">{address}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:pt-0.5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">দ্রুত লিংক</p>
              <div className="mt-3 grid gap-2.5">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between text-sm font-medium text-slate-800 transition hover:text-primary-red"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary-red">+</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">সামাজিক মাধ্যম</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {socialLinks.length > 0 ? (
                  socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-slate-700 transition hover:text-primary-red"
                    >
                      {item.label}
                    </a>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">সামাজিক মাধ্যমের লিংক যোগ করতে সাইট সেটিংস আপডেট করুন।</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 pt-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{footerText}</p>
          <p className="flex items-center gap-2">
            <span>কারিগরি সহযোগিতায়</span>
            <a
              href="https://grayvally.tech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white transition hover:bg-slate-700"
            >
              GrayVally
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

