"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { formatBengaliDate, toBengaliDigits } from "@/lib/bengali-date";
import ZoneDrawingCanvas, { type Zone } from "@/components/epaper/ZoneDrawingCanvas";

interface ClipData {
  id?: string;
  title?: string;
  zoneX?: number;
  zoneY?: number;
  zoneW?: number;
  zoneH?: number;
  continuedFrom?: string;
  linkedArticleSlug?: string;
  clipImages?: unknown[];
}

interface PageData {
  pageNumber: number;
  pageImage: { id?: number | string; url?: string } | number | string | null;
  articleClips: ClipData[];
}

interface HeaderZoneData {
  pageNumber: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EpaperData {
  id: string;
  issueDate: string;
  pages: PageData[];
  headerZonePageNumber?: number;
  headerZoneX?: number;
  headerZoneY?: number;
  headerZoneW?: number;
  headerZoneH?: number;
  footerZonePageNumber?: number;
  footerZoneX?: number;
  footerZoneY?: number;
  footerZoneW?: number;
  footerZoneH?: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;
const autoGroupId = (pageNum: number, zoneIdx: number) => `p${pageNum}z${zoneIdx}`;
const AUTO_TITLE_PATTERN = /^(Zone|সংবাদ)\s+\d+$/i;
const AUTO_GROUP_PATTERN = /^(p\d+z\d+(?:-\d+)?|news-\d{4}-\d{2}-\d{2}-p\d+-z\d+)$/i;
const AUTO_SLUG_PATTERN = /^(news-\d{4}-\d{2}-\d{2}-p\d+-z\d+|zone-\d+)$/i;

const getIssueDateKey = (issueDate?: string) => {
  if (!issueDate) return "undated";

  const parsed = new Date(issueDate);
  if (Number.isNaN(parsed.getTime())) return "undated";

  return parsed.toISOString().slice(0, 10);
};

const getIssueDateLabel = (issueDate?: string) => {
  if (!issueDate) return "তারিখবিহীন সংবাদ";
  return formatBengaliDate(issueDate) || issueDate.split("T")[0] || "তারিখবিহীন সংবাদ";
};

const buildAutoZoneMeta = (issueDate: string | undefined, pageNumber: number, zoneIndex: number) => {
  const issueDateKey = getIssueDateKey(issueDate);
  const issueDateLabel = getIssueDateLabel(issueDate);
  const zoneNumber = zoneIndex + 1;

  return {
    title: `${issueDateLabel} | পাতা ${toBengaliDigits(pageNumber)} | সংবাদ ${toBengaliDigits(zoneNumber)}`,
    articleGroup: `news-${issueDateKey}-p${pageNumber}-z${zoneNumber}`,
    linkedArticleSlug: `news-${issueDateKey}-p${pageNumber}-z${zoneNumber}`,
    partLabel: `${issueDateLabel} | পাতা ${toBengaliDigits(pageNumber)} | অংশ ${toBengaliDigits(zoneNumber)}`,
  };
};

const normalizeZoneMeta = (zone: Zone, issueDate: string | undefined, pageNumber: number, zoneIndex: number): Zone => {
  const autoMeta = buildAutoZoneMeta(issueDate, pageNumber, zoneIndex);

  return {
    ...zone,
    title: !zone.title || AUTO_TITLE_PATTERN.test(zone.title) ? autoMeta.title : zone.title,
    articleGroup: !zone.articleGroup || AUTO_GROUP_PATTERN.test(zone.articleGroup) ? autoMeta.articleGroup : zone.articleGroup,
    linkedArticleSlug: !zone.linkedArticleSlug || AUTO_SLUG_PATTERN.test(zone.linkedArticleSlug)
      ? autoMeta.linkedArticleSlug
      : zone.linkedArticleSlug,
  };
};

const normalizePageZones = (zones: Zone[], issueDate: string | undefined, pageNumber: number) => {
  let changed = false;

  const normalized = zones.map((zone, zoneIndex) => {
    const nextZone = normalizeZoneMeta(zone, issueDate, pageNumber, zoneIndex);
    if (
      nextZone.title !== zone.title ||
      nextZone.articleGroup !== zone.articleGroup ||
      nextZone.linkedArticleSlug !== zone.linkedArticleSlug
    ) {
      changed = true;
    }

    return nextZone;
  });

  return changed ? normalized : zones;
};

type ArticleCard = {
  group: string;
  zoneId: string;
  title: string;
  count: number;
  linkedPages: number[];
  linkedTotal: number;
  missingTitle: boolean;
};

export default function ZoneEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [epaperId, setEpaperId] = useState<string>("");
  const [epaper, setEpaper] = useState<EpaperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [allPageZones, setAllPageZones] = useState<Record<number, Zone[]>>({});
  const [headerZone, setHeaderZone] = useState<HeaderZoneData | null>(null);
  const [footerZone, setFooterZone] = useState<HeaderZoneData | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    sourcePageIndex: number;
    sourceZoneId: string;
    group: string;
    title: string;
  } | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;

    params.then((p) => {
      if (mounted) {
        setEpaperId(p.id);
      }
    });

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!epaperId) return;

    let mounted = true;
    const controller = new AbortController();

    setLoading(true);
    fetch(`/api/epapers/${epaperId}?depth=1`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: EpaperData) => {
        if (!mounted) return;

        setEpaper(data);

        const pageZones: Record<number, Zone[]> = {};

        (data.pages || []).forEach((page, pageIdx) => {
          const mapped = normalizePageZones(
            (page.articleClips || []).map((clip, clipIdx) => ({
              id: clip.id || `existing_${pageIdx}_${clipIdx}_${Date.now()}`,
              x: typeof clip.zoneX === "number" ? clip.zoneX : 0,
              y: typeof clip.zoneY === "number" ? clip.zoneY : 0,
              w: typeof clip.zoneW === "number" ? clip.zoneW : 12,
              h: typeof clip.zoneH === "number" ? clip.zoneH : 12,
              title: clip.title || "",
              articleGroup: clip.continuedFrom || "",
              linkedArticleSlug: clip.linkedArticleSlug || "",
            })),
            data.issueDate,
            page.pageNumber
          );

          pageZones[pageIdx] = mapped;
        });

        setAllPageZones(pageZones);
        setZones(pageZones[0] || []);
        setHeaderZone(
          typeof data.headerZonePageNumber === "number" &&
          typeof data.headerZoneX === "number" &&
          typeof data.headerZoneY === "number" &&
          typeof data.headerZoneW === "number" &&
          typeof data.headerZoneH === "number"
            ? {
                pageNumber: data.headerZonePageNumber,
                x: data.headerZoneX,
                y: data.headerZoneY,
                w: data.headerZoneW,
                h: data.headerZoneH,
              }
            : null
        );
        setFooterZone(
          typeof data.footerZonePageNumber === "number" &&
          typeof data.footerZoneX === "number" &&
          typeof data.footerZoneY === "number" &&
          typeof data.footerZoneW === "number" &&
          typeof data.footerZoneH === "number"
            ? {
                pageNumber: data.footerZonePageNumber,
                x: data.footerZoneX,
                y: data.footerZoneY,
                w: data.footerZoneW,
                h: data.footerZoneH,
              }
            : null
        );
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [epaperId]);

  useEffect(() => {
    setAllPageZones((prev) => ({ ...prev, [selectedPageIndex]: zones }));
  }, [zones, selectedPageIndex]);

  const switchToPage = useCallback(
    (newIdx: number) => {
      setAllPageZones((prev) => ({ ...prev, [selectedPageIndex]: zones }));
      setZones(allPageZones[newIdx] || []);
      setSelectedPageIndex(newIdx);
      setSelectedZoneId(null);
      setSaveMessage(null);
    },
    [allPageZones, selectedPageIndex, zones]
  );

  const updateZone = (id: string, updates: Partial<Zone>) => {
    setZones((prev) => prev.map((zone) => (zone.id === id ? { ...zone, ...updates } : zone)));
  };

  const handleZonesChange = useCallback(
    (nextZones: Zone[]) => {
      const pageNumber = epaper?.pages?.[selectedPageIndex]?.pageNumber ?? selectedPageIndex + 1;
      setZones(normalizePageZones(nextZones, epaper?.issueDate, pageNumber));
    },
    [epaper?.issueDate, epaper?.pages, selectedPageIndex]
  );

  const createNewArticle = useCallback(() => {
    const pageNumber = epaper?.pages?.[selectedPageIndex]?.pageNumber ?? selectedPageIndex + 1;
    const nextIndex = zones.length;
    const autoMeta = buildAutoZoneMeta(epaper?.issueDate, pageNumber, nextIndex);
    const newZone: Zone = {
      id: `zone_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      x: 8,
      y: 8,
      w: 22,
      h: 14,
      title: autoMeta.title,
      articleGroup: autoMeta.articleGroup,
      linkedArticleSlug: autoMeta.linkedArticleSlug,
    };

    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
    setPendingConnection(null);
    setSaveMessage("নতুন সংবাদ যোগ হয়েছে");
  }, [epaper?.issueDate, epaper?.pages, selectedPageIndex, zones.length]);

  const addPartToSelectedArticle = useCallback(() => {
    if (!selectedZoneId) return;

    const sourceZone = zones.find((zone) => zone.id === selectedZoneId);
    if (!sourceZone) return;

    const nextZone: Zone = {
      ...sourceZone,
      id: `zone_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      x: Math.min(sourceZone.x + 2, 82),
      y: Math.min(sourceZone.y + 2, 86),
      w: sourceZone.w,
      h: sourceZone.h,
      title: sourceZone.title,
      articleGroup: sourceZone.articleGroup,
    };

    setZones((prev) => [...prev, nextZone]);
    setSelectedZoneId(nextZone.id);
    setPendingConnection(null);
    setSaveMessage("নির্বাচিত সংবাদে নতুন অংশ যোগ হয়েছে");
  }, [selectedZoneId, zones]);

  const duplicateSelectedArticle = useCallback(() => {
    if (!selectedZoneId) return;

    const sourceZone = zones.find((zone) => zone.id === selectedZoneId);
    if (!sourceZone) return;

    const pageNumber = epaper?.pages?.[selectedPageIndex]?.pageNumber ?? selectedPageIndex + 1;
    const nextIndex = zones.length;
    const autoMeta = buildAutoZoneMeta(epaper?.issueDate, pageNumber, nextIndex);
    const nextZone: Zone = {
      ...sourceZone,
      id: `zone_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      x: Math.min(sourceZone.x + 2, 78),
      y: Math.min(sourceZone.y + 2, 84),
      title: autoMeta.title,
      articleGroup: autoMeta.articleGroup,
      linkedArticleSlug: autoMeta.linkedArticleSlug,
    };

    setZones((prev) => [...prev, nextZone]);
    setSelectedZoneId(nextZone.id);
    setPendingConnection(null);
    setSaveMessage("নির্বাচিত সংবাদটির একটি নতুন কপি যোগ হয়েছে");
  }, [epaper?.issueDate, epaper?.pages, selectedPageIndex, selectedZoneId, zones]);

  const getPageZones = useCallback(
    (pageIdx: number) => (pageIdx === selectedPageIndex ? zones : allPageZones[pageIdx] || []),
    [allPageZones, selectedPageIndex, zones]
  );

  const updateZoneOnPage = useCallback(
    (pageIdx: number, zoneId: string, updates: Partial<Zone>) => {
      if (pageIdx === selectedPageIndex) {
        setZones((prev) => prev.map((zone) => (zone.id === zoneId ? { ...zone, ...updates } : zone)));
        return;
      }

      setAllPageZones((prev) => ({
        ...prev,
        [pageIdx]: (prev[pageIdx] || []).map((zone) => (zone.id === zoneId ? { ...zone, ...updates } : zone)),
      }));
    },
    [selectedPageIndex]
  );

  const getStandaloneGroupId = useCallback(
    (pageIdx: number, zoneId: string) => {
      const pageNumber = epaper?.pages?.[pageIdx]?.pageNumber ?? pageIdx + 1;
      const zoneIdx = getPageZones(pageIdx).findIndex((zone) => zone.id === zoneId);
      const baseGroup = buildAutoZoneMeta(epaper?.issueDate, pageNumber, Math.max(zoneIdx, 0)).articleGroup;
      const usedGroups = new Set(
        Object.values({
          ...allPageZones,
          [selectedPageIndex]: zones,
        })
          .flat()
          .filter((zone) => zone.id !== zoneId)
          .map((zone) => zone.articleGroup)
          .filter(Boolean)
      );

      if (!usedGroups.has(baseGroup)) return baseGroup;

      let suffix = 2;
      while (usedGroups.has(`${baseGroup}-${suffix}`)) {
        suffix += 1;
      }

      return `${baseGroup}-${suffix}`;
    },
    [allPageZones, epaper?.issueDate, epaper?.pages, getPageZones, selectedPageIndex, zones]
  );

  const getGroupZoneCount = useCallback(
    (group: string) => {
      if (!group) return 0;

      return Object.values({
        ...allPageZones,
        [selectedPageIndex]: zones,
      })
        .flat()
        .filter((zone) => zone.articleGroup === group).length;
    },
    [allPageZones, selectedPageIndex, zones]
  );

  const handleZonePick = useCallback(
    (zoneId: string | null) => {
      if (!zoneId) {
        setSelectedZoneId(null);
        return;
      }

      if (!pendingConnection) {
        setSelectedZoneId(zoneId);
        return;
      }

      if (
        pendingConnection.sourcePageIndex === selectedPageIndex &&
        pendingConnection.sourceZoneId === zoneId
      ) {
        setSelectedZoneId(zoneId);
        return;
      }

      if (pendingConnection.sourcePageIndex === selectedPageIndex) {
        setSelectedZoneId(zoneId);
        setSaveMessage("এই continuation একই পাতায় নয়। অন্য পাতায় গিয়ে matching zone সিলেক্ট করুন");
        return;
      }

      updateZoneOnPage(selectedPageIndex, zoneId, { articleGroup: pendingConnection.group });
      setSelectedZoneId(zoneId);
      setPendingConnection(null);
      setSaveMessage(`জোন সংযুক্ত হয়েছে: ${pendingConnection.title || "নির্বাচিত সংবাদ"}`);
    },
    [pendingConnection, selectedPageIndex, updateZoneOnPage]
  );

  const startConnectionMode = useCallback(() => {
    if (!selectedZoneId) return;

    const sourceZone = zones.find((zone) => zone.id === selectedZoneId);
    if (!sourceZone) return;

    const group = sourceZone.articleGroup || getStandaloneGroupId(selectedPageIndex, sourceZone.id);

    if (sourceZone.articleGroup !== group) {
      updateZoneOnPage(selectedPageIndex, sourceZone.id, { articleGroup: group });
    }

    setPendingConnection({
      sourcePageIndex: selectedPageIndex,
      sourceZoneId: sourceZone.id,
      group,
      title: sourceZone.title,
    });
    setSaveMessage("Continuation mode চালু আছে - এখন অন্য পাতায় গিয়ে matching zone সিলেক্ট করুন");
  }, [getStandaloneGroupId, selectedPageIndex, selectedZoneId, updateZoneOnPage, zones]);

  const disconnectSelectedZone = useCallback(() => {
    if (!selectedZoneId) return;

    const nextGroup = getStandaloneGroupId(selectedPageIndex, selectedZoneId);
    updateZoneOnPage(selectedPageIndex, selectedZoneId, { articleGroup: nextGroup });

    if (
      pendingConnection?.sourcePageIndex === selectedPageIndex &&
      pendingConnection.sourceZoneId === selectedZoneId
    ) {
      setPendingConnection(null);
    }

    setSaveMessage("নির্বাচিত জোনটি আলাদা করা হয়েছে");
  }, [getStandaloneGroupId, pendingConnection, selectedPageIndex, selectedZoneId, updateZoneOnPage]);

  const deleteSelectedZone = () => {
    if (!selectedZoneId) return;
    setZones((prev) => prev.filter((zone) => zone.id !== selectedZoneId));
    setSelectedZoneId(null);
  };

  const clearHeaderZone = useCallback(() => {
    setHeaderZone(null);
    setSaveMessage("পত্রিকার হেডার নির্বাচন মুছে ফেলা হয়েছে");
  }, []);

  const clearFooterZone = useCallback(() => {
    setFooterZone(null);
    setSaveMessage("পত্রিকার ফুটার নির্বাচন মুছে ফেলা হয়েছে");
  }, []);

  const handleSave = async () => {
    if (!epaper) return;

    setSaving(true);
    setSaveMessage(null);

    const finalZones = { ...allPageZones, [selectedPageIndex]: zones };

    const updatedPages = epaper.pages.map((page, pageIdx) => {
      const pageZones = finalZones[pageIdx] || [];
      const existingClips = page.articleClips || [];

      return {
        pageImage:
          typeof page.pageImage === "object" && page.pageImage
            ? page.pageImage.id || page.pageImage
            : page.pageImage,
        pageNumber: page.pageNumber,
        articleClips: pageZones.map((zoneData, zoneIdx) => {
          const autoMeta = buildAutoZoneMeta(epaper.issueDate, page.pageNumber, zoneIdx);

          return {
            title: zoneData.title || autoMeta.title,
            zoneX: round2(zoneData.x),
            zoneY: round2(zoneData.y),
            zoneW: round2(zoneData.w),
            zoneH: round2(zoneData.h),
            continuedFrom: zoneData.articleGroup || autoMeta.articleGroup,
            linkedArticleSlug: zoneData.linkedArticleSlug || autoMeta.linkedArticleSlug,
            clipImages: Array.isArray(existingClips[zoneIdx]?.clipImages)
              ? existingClips[zoneIdx].clipImages
              : [],
          };
        }),
      };
    });

    try {
      const response = await fetch(`/api/epapers/${epaperId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pages: updatedPages,
          headerZonePageNumber: headerZone?.pageNumber ?? null,
          headerZoneX: headerZone?.x ?? null,
          headerZoneY: headerZone?.y ?? null,
          headerZoneW: headerZone?.w ?? null,
          headerZoneH: headerZone?.h ?? null,
          footerZonePageNumber: footerZone?.pageNumber ?? null,
          footerZoneX: footerZone?.x ?? null,
          footerZoneY: footerZone?.y ?? null,
          footerZoneW: footerZone?.w ?? null,
          footerZoneH: footerZone?.h ?? null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        setSaveMessage(`সেভ ব্যর্থ: ${err?.errors?.[0]?.message || response.statusText}`);
      } else {
        setSaveMessage("সফলভাবে সেভ হয়েছে!");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("সেভ ব্যর্থ: নেটওয়ার্ক ত্রুটি");
    }

    setSaving(false);
  };

  const selectedZone = zones.find((zoneData) => zoneData.id === selectedZoneId);
  const currentPageData = epaper?.pages?.[selectedPageIndex];
  const currentImageUrl =
    currentPageData?.pageImage && typeof currentPageData.pageImage === "object"
      ? currentPageData.pageImage.url || null
      : null;
  const selectedPageNumber = epaper?.pages?.[selectedPageIndex]?.pageNumber ?? selectedPageIndex + 1;
  const headerPageData = headerZone
    ? epaper?.pages?.find((page) => page.pageNumber === headerZone.pageNumber)
    : null;
  const headerImageUrl =
    headerPageData?.pageImage && typeof headerPageData.pageImage === "object"
      ? headerPageData.pageImage.url || null
      : null;
  const headerCropUrl = headerZone && headerImageUrl
    ? `/api/epaper/crop?src=${encodeURIComponent(headerImageUrl)}&x=${headerZone.x}&y=${headerZone.y}&w=${headerZone.w}&h=${headerZone.h}`
    : null;
  const footerPageData = footerZone
    ? epaper?.pages?.find((page) => page.pageNumber === footerZone.pageNumber)
    : null;
  const footerImageUrl =
    footerPageData?.pageImage && typeof footerPageData.pageImage === "object"
      ? footerPageData.pageImage.url || null
      : null;
  const footerCropUrl = footerZone && footerImageUrl
    ? `/api/epaper/crop?src=${encodeURIComponent(footerImageUrl)}&x=${footerZone.x}&y=${footerZone.y}&w=${footerZone.w}&h=${footerZone.h}`
    : null;

  const applySelectedZoneAsHeader = useCallback(() => {
    if (!selectedZone) return;

    setHeaderZone({
      pageNumber: selectedPageNumber,
      x: selectedZone.x,
      y: selectedZone.y,
      w: selectedZone.w,
      h: selectedZone.h,
    });
    setSaveMessage("নির্বাচিত জোনটি পত্রিকার হেডার হিসেবে সেট হয়েছে");
  }, [selectedPageNumber, selectedZone]);

  const applySelectedZoneAsFooter = useCallback(() => {
    if (!selectedZone) return;

    setFooterZone({
      pageNumber: selectedPageNumber,
      x: selectedZone.x,
      y: selectedZone.y,
      w: selectedZone.w,
      h: selectedZone.h,
    });
    setSaveMessage("নির্বাচিত জোনটি পত্রিকার ফুটার হিসেবে সেট হয়েছে");
  }, [selectedPageNumber, selectedZone]);

  const getLinkedPages = (group: string): number[] => {
    if (!group || !epaper) return [];

    const pagesWithGroup: number[] = [];
    Object.entries(allPageZones).forEach(([pageIdxStr, pageZones]) => {
      const pageIdx = Number(pageIdxStr);
      if (pageIdx === selectedPageIndex) return;

      if (pageZones.some((zoneData) => zoneData.articleGroup === group)) {
        const pageNumber = epaper.pages?.[pageIdx]?.pageNumber;
        if (pageNumber) pagesWithGroup.push(pageNumber);
      }
    });

    return pagesWithGroup;
  };

  const articles: ArticleCard[] = Array.from(
    zones.reduce((map, zone, index) => {
      const key = zone.articleGroup || zone.id;
      const existing = map.get(key);

      if (existing) {
        existing.count += 1;
        if (!existing.title && zone.title) {
          existing.title = zone.title;
        }
        return map;
      }

      map.set(key, {
        group: key,
        zoneId: zone.id,
        title: zone.title || buildAutoZoneMeta(epaper?.issueDate, currentPageData?.pageNumber || selectedPageIndex + 1, index).title,
        count: 1,
        linkedPages: [],
        linkedTotal: 1,
        missingTitle: !zone.title,
      });

      return map;
    }, new Map<string, ArticleCard>())
  ).map(([, article]) => ({
    ...article,
    linkedPages: getLinkedPages(article.group),
    linkedTotal: getGroupZoneCount(article.group),
  }));

  const pageProgress = `${articles.length} সংবাদ / ${zones.length} জোন`;
  const selectedArticleGroup = selectedZone?.articleGroup || null;
  const selectedArticleZones = selectedArticleGroup
    ? zones.filter((zone) => zone.articleGroup === selectedArticleGroup)
    : selectedZone
      ? [selectedZone]
      : [];

  useEffect(() => {
    if (!selectedZone) return;

    const isUntitled = !selectedZone.title || AUTO_TITLE_PATTERN.test(selectedZone.title);
    if (!isUntitled) return;

    titleInputRef.current?.focus();
    titleInputRef.current?.select();
  }, [selectedZone?.id, selectedZone?.title]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="animate-pulse text-lg text-gray-500">ই-পেপার ডেটা লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!epaper) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-4">ই-পেপার পাওয়া যায়নি</h1>
        <Link href="/admin" className="text-primary-blue hover:underline">
          অ্যাডমিনে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-400 mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">জোন এডিটর — সংবাদ চিহ্নিত করুন</h1>
          <p className="text-sm text-gray-500">
            তারিখ: {epaper.issueDate?.split("T")[0]} | পৃষ্ঠা: {(epaper.pages || []).length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.includes("ব্যর্থ") ? "text-red-600" : "text-green-600"}`}>
              {saveMessage}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
          </button>

          <Link
            href="/admin/collections/epapers"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition"
          >
            অ্যাডমিনে ফেরত
          </Link>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#eef6ff)] px-4 py-4 text-xs text-slate-700 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-800 shadow-sm">১. + দিয়ে নতুন সংবাদ যোগ করুন</span>
          <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-800 shadow-sm">২. পাতায় জোন আঁকুন বা সরান</span>
          <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-800 shadow-sm">৩. সংযুক্ত অংশ থাকলে লিংক করুন</span>
          <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-800 shadow-sm">৪. হেডার অংশ চাইলে আলাদা করে সেট করুন</span>
          <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-800 shadow-sm">৫. ফুটার অংশও একইভাবে আলাদা করে সেট করুন</span>
          <span className="ml-auto rounded-full bg-slate-900 px-2.5 py-1 font-medium text-white">{pageProgress}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(epaper.pages || []).map((page, idx) => {
          const count = idx === selectedPageIndex ? zones.length : (allPageZones[idx] || []).length;
          const isContinuationTarget = pendingConnection ? idx !== pendingConnection.sourcePageIndex : false;
          return (
            <button
              key={idx}
              onClick={() => switchToPage(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                idx === selectedPageIndex
                  ? "bg-navy text-white"
                  : isContinuationTarget
                    ? "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              পাতা {page.pageNumber}
              {count > 0 && <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b bg-[linear-gradient(90deg,#f8fafc,#ffffff)] px-4 py-3 text-xs text-gray-500 flex items-center gap-4 flex-wrap">
              <span>ড্র্যাগ করে জোন আঁকুন</span>
              <span>ক্লিক করে সংবাদ সিলেক্ট করুন</span>
              <span>ধারাবাহিক অংশ থাকলে সংযুক্ত করুন</span>
              <span className="ml-auto rounded-full bg-gray-100 px-2 py-1 text-gray-600">জোন: {zones.length}</span>
            </div>

            {currentImageUrl ? (
              <ZoneDrawingCanvas
                imageUrl={currentImageUrl}
                zones={zones}
                onChange={handleZonesChange}
                selectedZoneId={selectedZoneId}
                onSelectZone={handleZonePick}
              />
            ) : (
              <div className="aspect-3/4 flex items-center justify-center bg-gray-100 text-gray-400">
                এই পাতার জন্য কোনো ছবি আপলোড করা হয়নি
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#eef6ff,#ffffff)] px-4 py-4">
              <h3 className="font-bold text-sm text-navy">পত্রিকার হেডার</h3>
              <p className="text-xs text-gray-500">এখান থেকে আলাদা করে masthead/header crop সেট করুন। এটি সব article page-এর উপরে দেখানো হবে।</p>
            </div>
            <div className="space-y-3 p-4">
              {headerCropUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={headerCropUrl}
                    alt="Newspaper header preview"
                    className="block w-full h-auto"
                  />
                  <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
                    পাতা {headerZone?.pageNumber} থেকে header crop সিলেক্ট করা হয়েছে
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">
                  এখনো newspaper header set করা হয়নি। ক্যানভাসে zone select করে নিচের button ব্যবহার করুন।
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applySelectedZoneAsHeader}
                  disabled={!selectedZone}
                  className="rounded-lg bg-navy px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  selected zone-কে header করুন
                </button>
                <button
                  type="button"
                  onClick={clearHeaderZone}
                  disabled={!headerZone}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  header clear করুন
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#fff7f0,#ffffff)] px-4 py-4">
              <h3 className="font-bold text-sm text-navy">পত্রিকার ফুটার</h3>
              <p className="text-xs text-gray-500">নিচের strip/footer অংশ আলাদা করে সেট করুন। এটি সব article page-এর নিচে দেখানো হবে।</p>
            </div>
            <div className="space-y-3 p-4">
              {footerCropUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={footerCropUrl}
                    alt="Newspaper footer preview"
                    className="block w-full h-auto"
                  />
                  <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
                    পাতা {footerZone?.pageNumber} থেকে footer crop সিলেক্ট করা হয়েছে
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">
                  এখনো newspaper footer set করা হয়নি। ক্যানভাসে zone select করে নিচের button ব্যবহার করুন।
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applySelectedZoneAsFooter}
                  disabled={!selectedZone}
                  className="rounded-lg bg-navy px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  selected zone-কে footer করুন
                </button>
                <button
                  type="button"
                  onClick={clearFooterZone}
                  disabled={!footerZone}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  footer clear করুন
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#fff7f7,#ffffff)] px-4 py-4">
              <div>
                <div>
                  <h3 className="font-bold text-sm text-navy">আর্টিকেলসমূহ</h3>
                  <p className="text-xs text-gray-500">লিস্ট থেকেই zone যোগ করুন, সিলেক্ট করুন, আর selected row থেকেই quick action নিন</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2 max-h-84 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={createNewArticle}
                  className="flex w-full items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-left transition hover:border-primary-red hover:bg-red-50"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800">নতুন Zone যোগ করুন</div>
                    <div className="mt-1 text-[11px] text-slate-500">লিস্টে সঙ্গে সঙ্গে নতুন নাম আর জোন তৈরি হবে</div>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-red text-lg font-semibold text-white shadow-sm">
                    +
                  </span>
                </button>

              {articles.length > 0 ? (
                <div className="space-y-2">
                  {articles.map((article, index) => {
                    const isActive = article.zoneId === selectedZoneId || zones.some(
                      (zone) => zone.articleGroup === article.group && zone.id === selectedZoneId
                    );

                    return (
                      <div
                        key={article.group}
                        className={`relative rounded-2xl border transition ${
                          isActive
                            ? "border-primary-red bg-red-50 shadow-[0_12px_30px_rgba(239,68,68,0.08)] ring-2 ring-red-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3 px-3 py-3">
                          <button
                            type="button"
                            onClick={() => handleZonePick(article.zoneId)}
                            className="flex min-w-0 flex-1 items-start gap-3 text-left"
                          >
                            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                              isActive ? "bg-primary-red text-white" : "bg-slate-100 text-slate-600"
                            }`}>
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`truncate text-sm font-semibold ${isActive ? "text-primary-red" : "text-slate-800"}`}>
                                {article.title}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                                <span>{article.count} অংশ</span>
                                {article.linkedPages.length > 0 && (
                                  <span>পৃষ্ঠা {article.linkedPages.join(", ")}</span>
                                )}
                                {article.missingTitle && <span className="text-amber-700">নাম দিন</span>}
                              </div>
                            </div>
                          </button>

                          {isActive && (
                            <div className="flex shrink-0 items-center gap-1 self-center">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleZonePick(article.zoneId);
                                  startConnectionMode();
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-red text-base font-semibold text-white shadow-sm transition hover:bg-red-700"
                                aria-label="Continue on another page"
                                title="Continue on another page"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  duplicateSelectedArticle();
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                aria-label="Duplicate selected zone"
                                title="Duplicate zone"
                              >
                                C
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteSelectedZone();
                                }}
                                className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
                                aria-label="Delete selected zone"
                                title="Delete zone"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">
                  এখনো কোনো article নেই। উপরের add row থেকে শুরু করুন।
                </p>
              )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-navy">নির্বাচিত আর্টিকেল</h3>
                <p className="text-xs text-gray-500">নাম, group, slug এবং parts এখান থেকে ম্যানেজ করুন</p>
              </div>
            </div>

            {pendingConnection && (
              <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Continuation mode is active. Source: {pendingConnection.title || "Selected zone"} on page {epaper.pages?.[pendingConnection.sourcePageIndex]?.pageNumber}. Switch to page 2 or 3 and select the continuation zone there.
              </div>
            )}

            {selectedZone ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">সংবাদের শিরোনাম</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={selectedZone.title}
                    onChange={(e) => updateZone(selectedZone.id, { title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">সংযোগ গ্রুপ</label>
                  <input
                    type="text"
                    value={selectedZone.articleGroup}
                    onChange={(e) => updateZone(selectedZone.id, { articleGroup: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none"
                    placeholder="e.g. story-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">অনলাইন আর্টিকেল স্লাগ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={selectedZone.linkedArticleSlug}
                    onChange={(e) => updateZone(selectedZone.id, { linkedArticleSlug: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none"
                    placeholder="post-slug"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-500 grid grid-cols-4 gap-1 text-center">
                  <div>X: {selectedZone.x.toFixed(1)}%</div>
                  <div>Y: {selectedZone.y.toFixed(1)}%</div>
                  <div>W: {selectedZone.w.toFixed(1)}%</div>
                  <div>H: {selectedZone.h.toFixed(1)}%</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={startConnectionMode}
                    className="rounded-lg bg-navy px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    অন্য পাতায় continuation দিন
                  </button>
                  <button
                    onClick={disconnectSelectedZone}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    disabled={getGroupZoneCount(selectedZone.articleGroup) <= 1}
                  >
                    সংযোগ বিচ্ছিন্ন করুন
                  </button>
                </div>

                {selectedZone.articleGroup && (
                  <div className="text-xs text-gray-500">
                    সংযুক্ত জোন: {getGroupZoneCount(selectedZone.articleGroup)} টি | সংযুক্ত পাতা: {getLinkedPages(selectedZone.articleGroup).join(", ") || "নেই"}
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-700">এই আর্টিকেলের অংশসমূহ</h4>
                    <span className="text-[11px] text-slate-500">{selectedArticleZones.length} টি</span>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {selectedArticleZones.map((zone, index) => {
                      const isActivePart = zone.id === selectedZoneId;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => handleZonePick(zone.id)}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                            isActivePart
                              ? "border-primary-red bg-white shadow-sm"
                              : "border-transparent bg-white/70 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className={`truncate text-xs font-semibold ${isActivePart ? "text-primary-red" : "text-slate-700"}`}>
                                {buildAutoZoneMeta(epaper?.issueDate, selectedPageNumber, index).partLabel}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-500">
                                X: {zone.x.toFixed(1)}% | Y: {zone.y.toFixed(1)}% | W: {zone.w.toFixed(1)}% | H: {zone.h.toFixed(1)}%
                              </div>
                            </div>
                            <span className={`h-2.5 w-2.5 rounded-full ${isActivePart ? "bg-primary-red" : "bg-slate-300"}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                একটি জোন সিলেক্ট করুন বা নতুন জোন আঁকুন
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
