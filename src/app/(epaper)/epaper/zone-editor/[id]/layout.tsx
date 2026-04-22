import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPayloadClient } from "@/lib/payload-helpers";

export const dynamic = "force-dynamic";

export default async function ZoneEditorProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayloadClient();
  const requestHeaders = new Headers(await headers());
  const { user } = await payload.auth({ headers: requestHeaders });
  const role = (user as { role?: string } | null)?.role;

  if (!user || (role !== "admin" && role !== "editor")) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
