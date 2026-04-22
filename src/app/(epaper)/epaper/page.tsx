import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import EpaperClientViewer from "@/components/epaper/EpaperClientViewer";
import DateArchive from "@/components/epaper/DateArchive";
import AdZone from "@/components/ui/AdZone";
import { getLatestEPaper, getEPaperByDate } from "@/lib/payload-helpers";
import { formatBengaliDate } from "@/lib/bengali-date";
import { getSiteUrl } from "@/lib/env";

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { date } = await searchParams;
  const siteUrl = getSiteUrl();

  return {
    title: date
      ? `ই-পেপার — ${date} | দৈনিক নিউ টাইমস`
      : "ই-পেপার | দৈনিক নিউ টাইমস",
    description: "দৈনিক নিউ টাইমস ই-পেপার — পত্রিকার পাতা অনলাইনে পড়ুন",
    alternates: {
      canonical: date
        ? `${siteUrl}/epaper?date=${encodeURIComponent(date)}`
        : `${siteUrl}/epaper`,
    },
  };
}

export default async function EpaperPage({ searchParams }: Props) {
  const { date } = await searchParams;

  // Fetch by date or latest
  const epaper = date
    ? await getEPaperByDate(date)
    : await getLatestEPaper();

  // Sort pages by page number
  const pages = epaper?.pages
    ? [...epaper.pages].sort((a: any, b: any) => a.pageNumber - b.pageNumber)
    : [];

  // Build page labels
  const pageLabels = pages.map((p: any, i: number) => {
    if (i === 0) return "প্রথম পাতা";
    if (i === pages.length - 1) return "শেষ পাতা";
    return `${toBengaliOrdinal(i + 1)} পাতা`;
  });

  const issueDate = epaper?.issueDate || null;
  const issueDateKey = issueDate || date || "";
  const formattedIssueDate = issueDate ? formatBengaliDate(issueDate) : null;

  return (
    <div className="max-w-350 mx-auto px-3 py-4 md:px-4 md:py-6">
      {epaper && (
        <div className="mb-4 border border-slate-200 bg-white px-3 py-3 shadow-sm md:px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-sm">🗓</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Issue Date</span>
              </div>
              {formattedIssueDate && (
                <h2 className="mt-1 text-lg font-bold leading-snug text-navy md:text-xl">
                  {formattedIssueDate}
                </h2>
              )}
            </div>

            <Link
              href="/"
              className="flex h-12 shrink-0 items-center justify-center border border-primary-blue bg-white px-3 text-center text-[11px] font-semibold leading-tight text-primary-blue transition hover:bg-blue-50 md:h-12 md:px-4 md:text-xs"
            >
              <span>অনলাইন ভার্সন →</span>
            </Link>
          </div>

          <div className="mt-3 flex justify-center md:justify-start">
            <div className="w-full max-w-80 md:max-w-96">
              <AdZone slot="in-article" className="w-full" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main area */}
        <div className="lg:col-span-9">
          {epaper ? (
            <EpaperClientViewer
              pages={pages}
              pageLabels={pageLabels}
              issueDate={issueDateKey}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-xl font-bold mb-2">
                {date
                  ? "এই তারিখের পত্রিকা পাওয়া যায়নি"
                  : "কোনো ই-পেপার প্রকাশিত হয়নি"}
              </h2>
              <p className="text-text-muted mb-4">
                {date
                  ? "অন্য তারিখ দিয়ে চেষ্টা করুন।"
                  : "অনুগ্রহ করে পরে আবার চেক করুন।"}
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2 bg-primary-red text-white rounded font-medium hover:bg-red-700 transition"
              >
                হোম পেজে যান
              </Link>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <DateArchive currentDate={date || issueDate || undefined} />

          {/* Quick page nav */}
          {pages.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-sm mb-3 text-navy">পাতা নির্বাচন</h3>
              <div className="grid grid-cols-2 gap-2">
                {pageLabels.map((label: string, i: number) => (
                  <div
                    key={i}
                    className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-center"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-sm mb-2 text-navy">নির্দেশনা</h3>
            <ul className="text-xs text-text-muted space-y-1.5">
              <li>◉ বাম/ডান তীর চিহ্ন দিয়ে পাতা পরিবর্তন করুন</li>
              <li>◉ কিবোর্ডের ← → তীর কী ব্যবহার করুন</li>
              <li>◉ মোবাইলে সোয়াইপ করে পাতা পরিবর্তন করুন</li>
              <li>◉ নিচের থাম্বনেইলে ক্লিক করে যেকোনো পাতায় যান</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Helper: convert number to Bengali ordinal label
function toBengaliOrdinal(n: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const str = n.toString();
  return str.replace(/\d/g, (d) => bengaliDigits[parseInt(d)]) + "য়";
}

