import React from "react";

import { getSiteSettings } from "@/lib/payload-helpers";

export default async function Footer() {
  const settings = await getSiteSettings().catch(() => null);

  const chiefEditor = settings?.editorInfo?.chiefEditor || "সম্পাদকীয় টিম";
  const editor = settings?.editorInfo?.editor || "নিউ টাইমস";
  const publisherInfo = settings?.editorInfo?.publisherInfo || "সম্পাদক কর্তৃক প্রকাশিত।";

  const phone = settings?.contactInfo?.phone || "+8801XXXXXXXXX";
  const email = settings?.contactInfo?.email || "info@dainiknewtimes.com";
  const address = settings?.contactInfo?.address || "Dhaka, Bangladesh";

  const footerText =
    settings?.footerText ||
    `স্বত্ব © ${new Date().getFullYear()} দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।`;

  return (
    <footer className="bg-navy text-white py-8">
      <div className="max-w-300 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Editor info */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">সম্পাদক :</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              <strong>প্রধান সম্পাদক :</strong> {chiefEditor}
              <br />
              <strong>সম্পাদক :</strong> {editor}
              <br />
              <br />
              {publisherInfo}
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">যোগাযোগ :</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {phone}
              <br />
              <br />
              ইমেইল : {email}
            </p>
          </div>

          {/* Office address */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">অফিস :</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {address}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <p>{footerText}</p>
          <p>
            কারিগরি সহযোগিতায়: <span className="text-white font-medium">New Times</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

