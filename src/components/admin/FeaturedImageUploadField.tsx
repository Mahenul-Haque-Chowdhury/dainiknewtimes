"use client";

import React, { useMemo, useState } from "react";
import {
  BulkUploadProvider,
  UploadInput,
  toast,
  useConfig,
  useField,
  withCondition,
} from "@payloadcms/ui";
import { mergeFieldStyles } from "@payloadcms/ui/shared";
import type { UploadFieldClientProps } from "payload";
import type { ValueWithRelation } from "payload";

type MediaUploadResponse = {
  id?: number | string;
  message?: string;
  errors?: { message?: string }[];
};

function buildFilename(type: string) {
  const extension = type.split("/")[1] || "png";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `clipboard-${timestamp}.${extension}`;
}

async function createClipboardFile() {
  if (!navigator.clipboard?.read) {
    throw new Error("Clipboard image access is not supported in this browser.");
  }

  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    const imageType = clipboardItem.types.find((type) => type.startsWith("image/"));

    if (!imageType) {
      continue;
    }

    const blob = await clipboardItem.getType(imageType);

    return new File([blob], buildFilename(imageType), { type: imageType });
  }

  throw new Error("No image found in the clipboard.");
}

async function uploadClipboardImage(file: File, apiRoute: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt", "Pasted from clipboard");

  const response = await fetch(`${apiRoute}/media`, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  let payload: MediaUploadResponse | null = null;

  try {
    payload = (await response.json()) as MediaUploadResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.errors?.[0]?.message || payload?.message || "Clipboard image upload failed.";
    throw new Error(message);
  }

  const nextId = Number(payload?.id);

  if (!Number.isFinite(nextId)) {
    throw new Error("Media upload completed but no image ID was returned.");
  }

  return nextId;
}

function FeaturedImageUploadComponent(props: UploadFieldClientProps) {
  const {
    field,
    field: {
      admin: { allowCreate, className, description, isSortable } = {},
      hasMany,
      label,
      localized,
      maxRows,
      relationTo,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props;

  const { config } = useConfig();
  const [isUploading, setIsUploading] = useState(false);
  const displayPreview = field.displayPreview;
  const styles = useMemo(() => mergeFieldStyles(field), [field]);
  const memoizedValidate = React.useCallback(
    (value: unknown, options: Parameters<NonNullable<typeof validate>>[1]) => {
      if (typeof validate === "function") {
        return validate(value, {
          ...options,
          required,
        });
      }
    },
    [required, validate]
  );

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error: ErrorComponent, Label } = {},
    disabled,
    filterOptions,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate as never,
  });

  const uploadValue = value as
    | number
    | string
    | (number | string)[]
    | ValueWithRelation
    | ValueWithRelation[]
    | undefined;

  const handleClipboardUpload = async () => {
    if (isUploading || readOnly || disabled) {
      return;
    }

    setIsUploading(true);

    try {
      const file = await createClipboardFile();
      const nextId = await uploadClipboardImage(file, config.routes.api);

      setValue(nextId);
      toast.success("Clipboard image uploaded and selected as featured image.");
    } catch (error) {
      const message = error instanceof globalThis.Error ? error.message : "Clipboard image upload failed.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const customUploadAction = (
    <button
      key="paste-from-clipboard"
      type="button"
      onClick={handleClipboardUpload}
      disabled={isUploading || readOnly || disabled}
      style={{
        appearance: "none",
        border: "1px solid var(--theme-elevation-150, #4b5563)",
        background: "var(--theme-elevation-50, #1f2937)",
        color: "var(--theme-text, #ffffff)",
        borderRadius: 4,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: isUploading || readOnly || disabled ? "not-allowed" : "pointer",
        opacity: isUploading || readOnly || disabled ? 0.7 : 1,
      }}
    >
      {isUploading ? "Reading clipboard..." : "Paste from clipboard"}
    </button>
  );

  return (
    <BulkUploadProvider drawerSlugPrefix={pathFromProps}>
      <UploadInput
        AfterInput={
          <>
            {AfterInput}
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--theme-elevation-500, #94a3b8)" }}>
              Copy an image, then click "Paste from clipboard" to use it as the featured image.
            </div>
          </>
        }
        allowCreate={allowCreate !== false}
        api={config.routes.api}
        BeforeInput={BeforeInput}
        className={className}
        customUploadActions={[customUploadAction]}
        Description={Description}
        description={description}
        displayPreview={displayPreview}
        Error={ErrorComponent}
        filterOptions={filterOptions}
        hasMany={hasMany}
        isSortable={isSortable}
        label={label}
        Label={Label}
        localized={localized}
        maxRows={maxRows}
        onChange={setValue}
        path={path}
        readOnly={readOnly || disabled}
        relationTo={relationTo}
        required={required}
        serverURL={config.serverURL}
        showError={showError}
        style={styles}
        value={uploadValue}
      />
    </BulkUploadProvider>
  );
}

export default withCondition(FeaturedImageUploadComponent);