"use client";

import React from "react";
import { useDocumentInfo } from "@payloadcms/ui";

/**
 * Payload CMS custom UI component — renders an "Open Zone Editor" button
 * on the EPapers edit form. Uses the document ID to build the link.
 */
export default function ZoneEditorLink() {
  const { id } = useDocumentInfo();

  if (!id) {
    return (
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f0f4f8",
          borderRadius: 8,
          border: "1px solid #d0d7de",
          marginBottom: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          প্রথমে ই-পেপার সেভ করুন, তারপর জোন এডিটর ব্যবহার করতে পারবেন।
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f0f8ff",
        borderRadius: 8,
        border: "1px solid #0d6efd",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px 0", fontSize: 14, fontWeight: 600, color: "#0947a3" }}>
            ভিজ্যুয়াল জোন এডিটর
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            পাতায় মাউস দিয়ে আয়তক্ষেত্র আঁকুন — সংবাদের শিরোনাম ও গ্রুপ সেট করুন
          </p>
        </div>
        <a
          href={`/epaper/zone-editor/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 20px",
            backgroundColor: "#0d6efd",
            color: "#fff",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ✏️ জোন এডিটর খুলুন
        </a>
      </div>
    </div>
  );
}
