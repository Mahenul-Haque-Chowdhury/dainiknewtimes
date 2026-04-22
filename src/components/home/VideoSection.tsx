"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getMediaSizeUrl } from "@/lib/utils";

interface Video {
  title: string;
  youtubeUrl?: string;
  featuredImage?: any;
}

interface VideoSectionProps {
  videos: Video[];
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (videos.length === 0) {
    return (
      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2 border-b pb-2">
          🎥 ভিডিও
        </h2>
        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400">
          কোনো ভিডিও নেই
        </div>
      </div>
    );
  }

  const activeVideo = videos[activeIndex];
  const videoId = activeVideo?.youtubeUrl
    ? getYouTubeId(activeVideo.youtubeUrl)
    : null;

  return (
    <div>
      <h2 className="text-base font-bold mb-3 flex items-center gap-2 border-b pb-2">
        🎥 ভিডিও
      </h2>

      {/* Player */}
      <div className="aspect-video bg-black rounded overflow-hidden mb-3">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={activeVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
            ভিডিও উপলব্ধ নয়
          </div>
        )}
      </div>

      {/* Title */}
      {activeVideo?.title && (
        <p className="text-sm font-bold mb-3 line-clamp-2">{activeVideo.title}</p>
      )}

      {/* Video list */}
      {videos.length > 1 && (
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {videos.map((video, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex gap-2 items-start w-full text-left p-1.5 rounded transition ${
                i === activeIndex
                  ? "bg-primary-red/10 border border-primary-red/30"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-16 h-11 bg-gray-200 rounded shrink-0 relative overflow-hidden">
                {video.featuredImage ? (
                  <Image
                    src={getMediaSizeUrl(video.featuredImage, "thumbnail")}
                    alt={video.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400 text-xs">
                    ▶
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold line-clamp-2 flex-1">
                {video.title}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
