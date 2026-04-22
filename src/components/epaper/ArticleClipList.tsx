"use client";

import Link from "next/link";

interface ArticleClip {
  title: string;
}

interface ArticleClipListProps {
  clips: ArticleClip[];
  issueDate: string;
  pageNumber: number;
}

export default function ArticleClipList({
  clips,
  issueDate,
  pageNumber,
}: ArticleClipListProps) {
  if (!clips || clips.length === 0) return null;
  const dateKey = issueDate.split("T")[0];

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-navy mb-2 flex items-center gap-2">
        পাতা {pageNumber} এর সংবাদ সমূহ
        <span className="text-xs font-normal text-text-muted">
          (ক্লিক করে পড়ুন)
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {clips.map((clip, idx) => (
          <Link
            key={idx}
            href={`/epaper/article/${dateKey}/${pageNumber}/${idx}`}
            className="text-xs rounded px-3 py-1.5 transition text-left border bg-white border-gray-200 hover:border-primary-red hover:text-primary-red"
          >
            {clip.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
