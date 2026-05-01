"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  convertLegacyBanglaToUnicode,
  looksLikeLegacyBanglaText,
  shouldConvertLegacyBanglaPaste,
} from "@/lib/legacy-bangla";
import { slugify } from "@/lib/slug";

const AUTO_CONVERT_FIELD_NAMES = new Set(["title", "slug", "excerpt"]);

function isTextInput(element: EventTarget | null): element is HTMLInputElement | HTMLTextAreaElement {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  if (isTextInput(target)) {
    return target;
  }

  if (target.isContentEditable) {
    return target;
  }

  const editableAncestor = target.closest('[contenteditable="true"]');

  if (editableAncestor instanceof HTMLElement) {
    return editableAncestor;
  }

  const inputAncestor = target.closest("textarea, input[type='text']");

  if (isTextInput(inputAncestor)) {
    return inputAncestor;
  }

  return null;
}

function insertIntoInput(target: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? start;
  const nextValue = `${target.value.slice(0, start)}${text}${target.value.slice(end)}`;

  target.value = nextValue;
  target.setSelectionRange(start + text.length, start + text.length);
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

function setInputValue(target: HTMLInputElement | HTMLTextAreaElement, value: string) {
  if (target.value === value) {
    return;
  }

  target.value = value;
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

function convertIfLegacy(value: string) {
  if (!looksLikeLegacyBanglaText(value)) {
    return value;
  }

  return convertLegacyBanglaToUnicode(value);
}

function insertIntoContentEditable(target: HTMLElement, text: string) {
  target.focus();

  if (typeof document.execCommand === "function") {
    document.execCommand("insertText", false, text);
    return;
  }

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    target.textContent = `${target.textContent || ""}${text}`;
    target.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);

  selection.removeAllRanges();
  selection.addRange(range);
  target.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
}

export default function LegacyBanglaPasteHelper() {
  const [lastConvertedAt, setLastConvertedAt] = useState<number | null>(null);
  const isProgrammaticUpdateRef = useRef(false);

  const helperText = useMemo(() => {
    if (!lastConvertedAt) {
      return "SutonnyMJ বা JugantorMJ ফন্ট থেকে পেস্ট করলে এটি স্বয়ংক্রিয়ভাবে Unicode-এ কনভার্ট হবে।";
    }

    return "সর্বশেষ পেস্ট Unicode-এ কনভার্ট করা হয়েছে। এখন প্রকাশ করলে আর আলাদা করে রূপান্তর করতে হবে না।";
  }, [lastConvertedAt]);

  useEffect(() => {
    const syncManagedField = (target: HTMLInputElement | HTMLTextAreaElement) => {
      if (!AUTO_CONVERT_FIELD_NAMES.has(target.name)) {
        return;
      }

      const convertedValue = convertIfLegacy(target.value);
      let didChange = false;

      if (convertedValue !== target.value) {
        target.value = convertedValue;
        didChange = true;
      }

      if (target.name === "title") {
        const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');

        if (slugInput) {
          const nextSlug = slugify(target.value);

          if (slugInput.value !== nextSlug) {
            setInputValue(slugInput, nextSlug);
          }
        }
      } else if (target.name === "slug") {
        const normalizedSlug = slugify(convertedValue);

        if (normalizedSlug !== target.value) {
          target.value = normalizedSlug;
          didChange = true;
        }
      }

      if (didChange) {
        isProgrammaticUpdateRef.current = true;
        target.dispatchEvent(new Event("input", { bubbles: true }));
        isProgrammaticUpdateRef.current = false;
      }
    };

    const onPaste = (event: ClipboardEvent) => {
      if (!window.location.pathname.includes("/admin/collections/articles/")) {
        return;
      }

      const target = isEditableTarget(event.target);

      if (!target) {
        return;
      }

      const html = event.clipboardData?.getData("text/html") || "";
      const text = event.clipboardData?.getData("text/plain") || "";

      if (!shouldConvertLegacyBanglaPaste({ html, text })) {
        return;
      }

      const converted = convertLegacyBanglaToUnicode(text);

      if (!converted || converted === text) {
        return;
      }

      event.preventDefault();

      if (isTextInput(target)) {
        insertIntoInput(target, converted);
      } else {
        insertIntoContentEditable(target, converted);
      }

      setLastConvertedAt(Date.now());
    };

    const onInput = (event: Event) => {
      if (isProgrammaticUpdateRef.current) {
        return;
      }

      if (!window.location.pathname.includes("/admin/collections/articles/")) {
        return;
      }

      const target = event.target;

      if (!isTextInput(target)) {
        return;
      }

      if (!AUTO_CONVERT_FIELD_NAMES.has(target.name)) {
        return;
      }

      syncManagedField(target);
    };

    const initializeArticleFields = () => {
      const managedFields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input[name="title"], input[name="slug"], textarea[name="excerpt"]'
      );

      managedFields.forEach((field) => {
        syncManagedField(field);
      });
    };

    initializeArticleFields();

    document.addEventListener("paste", onPaste, true);
    document.addEventListener("input", onInput, true);

    return () => {
      document.removeEventListener("paste", onPaste, true);
      document.removeEventListener("input", onInput, true);
    };
  }, []);

  return (
    <div
      style={{
        marginBottom: 16,
        border: "1px solid #d6e4ff",
        borderRadius: 8,
        padding: "12px 14px",
        backgroundColor: "#f8fbff",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0947a3" }}>
        লিগেসি বাংলা পেস্ট সহায়ক
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.5, color: "#4b5563" }}>{helperText}</p>
    </div>
  );
}