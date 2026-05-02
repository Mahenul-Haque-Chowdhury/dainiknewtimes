"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

import styles from "./ZoneDrawingCanvas.module.css";

export interface Zone {
  id: string;
  x: number; // percentage 0-100
  y: number;
  w: number;
  h: number;
  title: string;
  articleGroup: string; // links multi-page parts
  linkedArticleSlug: string;
}

interface ZoneDrawingCanvasProps {
  imageUrl: string;
  zones: Zone[];
  onChange: (zones: Zone[]) => void;
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
}

// Colors for zones — cycle through for visual distinction
const ZONE_COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12",
  "#9b59b6", "#1abc9c", "#e67e22", "#e91e63",
];

function getZoneColor(index: number) {
  return ZONE_COLORS[index % ZONE_COLORS.length];
}

export default function ZoneDrawingCanvas({
  imageUrl,
  zones,
  onChange,
  selectedZoneId,
  onSelectZone,
}: ZoneDrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Convert mouse position to percentage coordinates
  const getPercentCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  // Generate unique ID
  const genId = () => `zone_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // --- DRAWING NEW ZONE ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drawing if clicking on empty area (not on a zone)
    if ((e.target as HTMLElement).closest("[data-zone-id]")) return;

    const coords = getPercentCoords(e);
    setIsDrawing(true);
    setDrawStart(coords);
    setDrawCurrent(coords);
    onSelectZone(null);
    e.preventDefault();
  }, [getPercentCoords, onSelectZone]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDrawing && drawStart) {
      setDrawCurrent(getPercentCoords(e));
      e.preventDefault();
    }
  }, [isDrawing, drawStart, getPercentCoords]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x);
      const y = Math.min(drawStart.y, drawCurrent.y);
      const w = Math.abs(drawCurrent.x - drawStart.x);
      const h = Math.abs(drawCurrent.y - drawStart.y);

      // Only create zone if it's bigger than 2% in both dimensions
      if (w > 2 && h > 2) {
        const newZone: Zone = {
          id: genId(),
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          w: Math.round(w * 100) / 100,
          h: Math.round(h * 100) / 100,
          title: "",
          articleGroup: "",
          linkedArticleSlug: "",
        };
        onChange([...zones, newZone]);
        onSelectZone(newZone.id);
      }
    }
    setIsDrawing(false);
    setDrawStart(null);
    setDrawCurrent(null);
  }, [isDrawing, drawStart, drawCurrent, zones, onChange, onSelectZone]);

  // --- DRAGGING EXISTING ZONE ---
  const handleZoneDragStart = useCallback((e: React.MouseEvent, zoneId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    const coords = getPercentCoords(e);
    setIsDragging(true);
    onSelectZone(zoneId);
    setDragOffset({ x: coords.x - zone.x, y: coords.y - zone.y });
  }, [zones, getPercentCoords, onSelectZone]);

  // --- RESIZING EXISTING ZONE ---
  const handleResizeStart = useCallback((e: React.MouseEvent, zoneId: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    onSelectZone(zoneId);
  }, [onSelectZone]);

  // Global mouse move/up for drag and resize
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleGlobalMove = (e: MouseEvent) => {
      const coords = getPercentCoords(e);

      if (isDragging && selectedZoneId) {
        const zone = zones.find((z) => z.id === selectedZoneId);
        if (!zone) return;
        let newX = coords.x - dragOffset.x;
        let newY = coords.y - dragOffset.y;
        // Clamp to bounds
        newX = Math.max(0, Math.min(100 - zone.w, newX));
        newY = Math.max(0, Math.min(100 - zone.h, newY));
        const updated = zones.map((z) =>
          z.id === selectedZoneId ? { ...z, x: Math.round(newX * 100) / 100, y: Math.round(newY * 100) / 100 } : z
        );
        onChange(updated);
      }

      if (isResizing && selectedZoneId && resizeHandle) {
        const zone = zones.find((z) => z.id === selectedZoneId);
        if (!zone) return;

        let { x, y, w, h } = zone;
        const minSize = 2;

        if (resizeHandle.includes("e")) {
          w = Math.max(minSize, Math.min(100 - x, coords.x - x));
        }
        if (resizeHandle.includes("w")) {
          const right = x + w;
          const newX = Math.max(0, Math.min(right - minSize, coords.x));
          w = right - newX;
          x = newX;
        }
        if (resizeHandle.includes("s")) {
          h = Math.max(minSize, Math.min(100 - y, coords.y - y));
        }
        if (resizeHandle.includes("n")) {
          const bottom = y + h;
          const newY = Math.max(0, Math.min(bottom - minSize, coords.y));
          h = bottom - newY;
          y = newY;
        }

        const updated = zones.map((z) =>
          z.id === selectedZoneId
            ? { ...z, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, w: Math.round(w * 100) / 100, h: Math.round(h * 100) / 100 }
            : z
        );
        onChange(updated);
      }
    };

    const handleGlobalUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("mouseup", handleGlobalUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalUp);
    };
  }, [isDragging, isResizing, selectedZoneId, zones, dragOffset, resizeHandle, onChange, getPercentCoords]);

  // Preview rectangle while drawing
  const previewRect = isDrawing && drawStart && drawCurrent
    ? {
        x: Math.min(drawStart.x, drawCurrent.x),
        y: Math.min(drawStart.y, drawCurrent.y),
        w: Math.abs(drawCurrent.x - drawStart.x),
        h: Math.abs(drawCurrent.y - drawStart.y),
      }
    : null;

  const resizeHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

  const handleCursorMap: Record<string, string> = {
    nw: "nw-resize", n: "n-resize", ne: "ne-resize", e: "e-resize",
    se: "se-resize", s: "s-resize", sw: "sw-resize", w: "w-resize",
  };

  const handlePositionMap: Record<string, React.CSSProperties> = {
    nw: { top: -4, left: -4 },
    n: { top: -4, left: "50%", transform: "translateX(-50%)" },
    ne: { top: -4, right: -4 },
    e: { top: "50%", right: -4, transform: "translateY(-50%)" },
    se: { bottom: -4, right: -4 },
    s: { bottom: -4, left: "50%", transform: "translateX(-50%)" },
    sw: { bottom: -4, left: -4 },
    w: { top: "50%", left: -4, transform: "translateY(-50%)" },
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ cursor: isDrawing ? "crosshair" : "default" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Page image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Newspaper page"
        className={styles.pageImage}
        onLoad={() => setImageLoaded(true)}
        draggable={false}
      />

      {!imageLoaded && (
        <div className={styles.loadingOverlay}>
          ছবি লোড হচ্ছে...
        </div>
      )}

      {/* Existing zones */}
      {zones.map((zone, idx) => {
        const isSelected = zone.id === selectedZoneId;
        const color = getZoneColor(idx);

        return (
          <div
            key={zone.id}
            data-zone-id={zone.id}
            className={`${styles.zone} ${isSelected ? styles.zoneSelected : ""}`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
              border: `2px solid ${color}`,
              backgroundColor: isSelected ? `${color}22` : `${color}11`,
              cursor: isDragging && isSelected ? "grabbing" : "grab",
              zIndex: isSelected ? 20 : 10,
            }}
            onMouseDown={(e) => handleZoneDragStart(e, zone.id)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectZone(zone.id);
            }}
          >
            {/* Zone label */}
            <div
              className={styles.zoneLabel}
              style={{ backgroundColor: color }}
            >
              {zone.title || `জোন ${idx + 1}`}
            </div>

            {/* Zone number badge */}
            <div
              className={styles.zoneBadge}
              style={{ backgroundColor: color }}
            >
              {idx + 1}
            </div>

            {/* Resize handles (only when selected) */}
            {isSelected &&
              resizeHandles.map((handle) => (
                <div
                  key={handle}
                  className={styles.resizeHandle}
                  style={{
                    ...handlePositionMap[handle],
                    border: `2px solid ${color}`,
                    cursor: handleCursorMap[handle],
                    zIndex: 30,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, zone.id, handle)}
                />
              ))}
          </div>
        );
      })}

      {/* Drawing preview rectangle */}
      {previewRect && (
        <div
          className={styles.previewRect}
          style={{
            left: `${previewRect.x}%`,
            top: `${previewRect.y}%`,
            width: `${previewRect.w}%`,
            height: `${previewRect.h}%`,
            border: "2px dashed #e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}
