import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import PrintButton from "@/components/epaper/PrintButton";
import { formatBengaliDate } from "@/lib/bengali-date";

interface Props {
  params: Promise<{ date: string; page: string; zone: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { date, page } = await params;
  return {
    title: `সংবাদ — পাতা ${page} | ই-পেপার ${date}`,
    description: "দৈনিক নিউ টাইমস ই-পেপার সংবাদ",
  };
}

export default async function ArticleDisplayPage({ params }: Props) {
  const { date, page, zone } = await params;
  const pageNum = parseInt(page, 10);
  const clipIdx = parseInt(zone, 10);

  if (!Number.isInteger(pageNum) || !Number.isInteger(clipIdx) || pageNum < 1 || clipIdx < 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-xl font-bold text-gray-700 mb-4">অবৈধ লিংক</h1>
        <Link href="/epaper" className="text-primary-blue hover:underline">
          ← ই-পেপারে ফিরে যান
        </Link>
      </div>
    );
  }

  const payload = await getPayload({ config });

  // Find EPaper by date (use range since dates are stored with time component)
  const dateStart = `${date}T00:00:00.000Z`;
  const dateEnd = `${date}T23:59:59.999Z`;
  const result = await payload.find({
    collection: "epapers",
    where: {
      and: [
        { issueDate: { greater_than_equal: dateStart } },
        { issueDate: { less_than_equal: dateEnd } },
        { status: { equals: "published" } },
      ],
    },
    depth: 1,
    limit: 1,
  });

  const epaper = result.docs[0] as any;

  if (!epaper) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-xl font-bold text-gray-700 mb-4">ই-পেপার পাওয়া যায়নি</h1>
        <Link href="/epaper" className="text-primary-blue hover:underline">
          ← ই-পেপারে ফিরে যান
        </Link>
      </div>
    );
  }

  const pages = epaper.pages || [];

  // Find the target page and article clip
  const targetPage = pages.find((p: any) => p.pageNumber === pageNum);
  const clips = targetPage?.articleClips || [];
  const targetClip = clips[clipIdx];

  if (!targetClip) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-xl font-bold text-gray-700 mb-4">সংবাদ পাওয়া যায়নি</h1>
        <Link href={`/epaper?date=${date}`} className="text-primary-blue hover:underline">
          ← ই-পেপারে ফিরে যান
        </Link>
      </div>
    );
  }

  interface ImagePart {
    url: string;
    caption: string;
    pageNumber: number;
    sourceTitle: string;
  }

  interface CropPart {
    pageImageUrl: string;
    pageNumber: number;
    zoneX: number;
    zoneY: number;
    zoneW: number;
    zoneH: number;
    title: string;
  }

  interface RelatedClipPart {
    clip: any;
    pageData: any;
    clipPosition: number;
  }

  const legacyGroup = typeof targetClip.continuedFrom === "string" ? targetClip.continuedFrom : undefined;
  const relatedClips: RelatedClipPart[] = legacyGroup
    ? pages.flatMap((pageData: any) =>
        (pageData.articleClips || [])
          .filter((clip: any) => clip.continuedFrom === legacyGroup)
          .map((clip: any, clipPosition: number) => ({
            clip,
            pageData,
            clipPosition,
          }))
      )
    : [{ clip: targetClip, pageData: targetPage, clipPosition: clipIdx }];

  const imageParts: ImagePart[] = [];
  const cropParts: CropPart[] = [];

  const toCropPart = (clip: any, pageData: any): CropPart | null => {
    const pageImageUrl = typeof pageData?.pageImage === "object" ? pageData.pageImage?.url : null;
    if (!pageImageUrl) return null;

    const { zoneX, zoneY, zoneW, zoneH } = clip || {};
    if (![zoneX, zoneY, zoneW, zoneH].every((value) => Number.isFinite(value))) {
      return null;
    }

    return {
      pageImageUrl,
      pageNumber: pageData.pageNumber,
      zoneX,
      zoneY,
      zoneW,
      zoneH,
      title: clip.title || "",
    };
  };

  relatedClips
    .sort((left: RelatedClipPart, right: RelatedClipPart) => {
      if (left.pageData.pageNumber !== right.pageData.pageNumber) {
        return left.pageData.pageNumber - right.pageData.pageNumber;
      }

      return left.clipPosition - right.clipPosition;
    })
    .forEach(({ clip, pageData }: RelatedClipPart) => {
      const clipImages = Array.isArray(clip.clipImages) ? clip.clipImages : [];
      const uploadedParts = clipImages
        .map((item: any) => {
          const image = item?.image;
          const imageUrl = typeof image === "object" ? image?.url : null;

          if (!imageUrl) return null;

          return {
            url: imageUrl,
            caption: item?.caption || "",
            pageNumber: pageData.pageNumber,
            sourceTitle: clip.title || targetClip.title || "",
          };
        })
        .filter((item: ImagePart | null): item is ImagePart => Boolean(item));

      if (uploadedParts.length > 0) {
        imageParts.push(...uploadedParts);
        return;
      }

      const cropPart = toCropPart(clip, pageData);
      if (cropPart) {
        cropParts.push(cropPart);
      }
    });

  const linkedSlug = targetClip.linkedArticleSlug;
  const issueDate = date;
  const normalizedTitle = typeof targetClip.title === "string" ? targetClip.title.trim() : "";
  const shouldShowTitle = normalizedTitle.length > 0 && !/^zone(?:\s+\d+)?$/i.test(normalizedTitle);
  const headerPageNumber = typeof epaper.headerZonePageNumber === "number" ? epaper.headerZonePageNumber : null;
  const headerPage = headerPageNumber
    ? pages.find((pageData: any) => pageData.pageNumber === headerPageNumber)
    : null;
  const headerImageUrl = typeof headerPage?.pageImage === "object" ? headerPage?.pageImage?.url : null;
  const hasHeaderCrop =
    headerImageUrl &&
    [epaper.headerZoneX, epaper.headerZoneY, epaper.headerZoneW, epaper.headerZoneH].every((value: unknown) => Number.isFinite(value));
  const headerCropUrl = hasHeaderCrop
    ? `/api/epaper/crop?src=${encodeURIComponent(headerImageUrl)}&x=${epaper.headerZoneX}&y=${epaper.headerZoneY}&w=${epaper.headerZoneW}&h=${epaper.headerZoneH}`
    : null;
  const footerPageNumber = typeof epaper.footerZonePageNumber === "number" ? epaper.footerZonePageNumber : null;
  const footerPage = footerPageNumber
    ? pages.find((pageData: any) => pageData.pageNumber === footerPageNumber)
    : null;
  const footerImageUrl = typeof footerPage?.pageImage === "object" ? footerPage?.pageImage?.url : null;
  const hasFooterCrop =
    footerImageUrl &&
    [epaper.footerZoneX, epaper.footerZoneY, epaper.footerZoneW, epaper.footerZoneH].every((value: unknown) => Number.isFinite(value));
  const footerCropUrl = hasFooterCrop
    ? `/api/epaper/crop?src=${encodeURIComponent(footerImageUrl)}&x=${epaper.footerZoneX}&y=${epaper.footerZoneY}&w=${epaper.footerZoneW}&h=${epaper.footerZoneH}`
    : null;

  // Page navigation links
  const pageLinks = pages
    .map((p: any) => ({ num: p.pageNumber }))
    .sort((a: any, b: any) => a.num - b.num);

  return (
    <div className="bg-[linear-gradient(180deg,#f5f4ef_0%,#ffffff_22%)] py-3 md:py-6">
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-3 md:px-4">
        <div className="border border-stone-200 bg-white/95 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-4 lg:p-5">
          {headerCropUrl && (
            <div className="mb-6 border-b border-stone-200 pb-5">
              <div className="border border-stone-200 bg-white p-2">
                <Image
                  src={headerCropUrl}
                  alt="Newspaper masthead"
                  width={1800}
                  height={420}
                  className="h-auto w-full object-contain"
                  unoptimized
                  priority
                />
              </div>
              <div className="mt-3 text-center text-sm font-medium text-stone-600">
                {formatBengaliDate(issueDate)}
              </div>
            </div>
          )}

          <nav className="mb-5 flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4 text-sm">
            <Link href={`/epaper?date=${issueDate}`} className="font-medium text-primary-blue hover:underline">
              ← ই-পেপার
            </Link>
            <span className="text-stone-300">|</span>
            {pageLinks.map((p: any) => (
              <Link
                key={p.num}
                href={`/epaper?date=${issueDate}`}
                className={`border px-3 py-1.5 text-xs transition ${
                  p.num === pageNum
                    ? "border-navy bg-navy text-white"
                    : "border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {p.num === 1 ? "প্রথম পাতা" : p.num === pageLinks.length ? "শেষ পাতা" : `${p.num}য় পাতা`}
              </Link>
            ))}
          </nav>

          <div className="w-full">
            {shouldShowTitle && (
              <h1 className="mb-3 text-xl font-bold leading-relaxed text-navy md:text-2xl">
                {targetClip.title}
              </h1>
            )}

            {legacyGroup && (imageParts.length + cropParts.length > 1) && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-white px-4 py-3 text-xs text-blue-900">
                এই সংবাদটি একাধিক সংযুক্ত অংশে আছে। নিচে সব অংশ ধারাবাহিকভাবে দেখানো হয়েছে।
              </div>
            )}

            {imageParts.length > 0 ? (
              <div className="space-y-3">
                {imageParts.map((part, idx) => (
                  <div key={idx} className="border border-stone-200 bg-white shadow-sm">
                    <Image
                      src={part.url as string}
                      alt={part.caption || targetClip.title || `অংশ ${idx + 1}`}
                      width={1600}
                      height={2200}
                      className="h-auto w-full"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    {(part.caption || legacyGroup) && (
                      <div className="border-t border-stone-200 bg-stone-50 px-3 py-1.5 text-center text-xs text-stone-500">
                        {part.caption || `পাতা ${part.pageNumber}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : cropParts.length > 0 ? (
              <div className="space-y-3">
                {cropParts.map((part, idx) => (
                  <div key={idx} className="border border-stone-200 bg-white shadow-sm">
                    <Image
                      src={`/api/epaper/crop?src=${encodeURIComponent(part.pageImageUrl)}&x=${part.zoneX}&y=${part.zoneY}&w=${part.zoneW}&h=${part.zoneH}`}
                      alt={part.title || `অংশ ${idx + 1}`}
                      width={1600}
                      height={2200}
                      className="h-auto w-full"
                      unoptimized
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    {cropParts.length > 1 && (
                      <div className="border-t border-stone-200 bg-stone-50 px-3 py-1.5 text-center text-xs text-stone-500">
                        পাতা {part.pageNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-stone-200 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
                এই সংবাদের জন্য কোনো কাটিং ছবি নেই।
              </div>
            )}

            {footerCropUrl && (
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="border border-stone-200 bg-white p-2">
                  <Image
                    src={footerCropUrl}
                    alt="Newspaper footer"
                    width={1800}
                    height={220}
                    className="h-auto w-full object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-stone-200 pt-4">
              <Link href={`/epaper?date=${issueDate}`} className="text-sm text-stone-600 transition hover:text-navy">
                ← ই-পেপারে ফিরে যান
              </Link>
              <PrintButton />
              {linkedSlug && (
                <Link
                  href={`/post/${linkedSlug}`}
                  className="ml-auto border border-blue-700 bg-primary-blue px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                >
                  অনলাইনে পড়ুন →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
