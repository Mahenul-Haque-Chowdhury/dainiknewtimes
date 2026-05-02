import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { canManageEPaper } from "@/lib/access";
import { getPayloadClient } from "@/lib/payload-helpers";

export const dynamic = "force-dynamic";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

function joinAdminPath(adminRoute: string, path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith(adminRoute)) {
    return path;
  }

  return `${adminRoute}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function AdminZoneEditorLayout({ children, params }: LayoutProps) {
  const payload = await getPayloadClient();
  const requestHeaders = new Headers(await headers());
  const { user } = await payload.auth({ headers: requestHeaders });
  const { id } = await params;
  const adminRoute = payload.config.routes.admin;
  const loginRoute = payload.config.admin.routes.login;
  const unauthorizedRoute = payload.config.admin.routes.unauthorized;
  const destination = `${adminRoute}/zone-editor/${id}`;

  if (!user) {
    const loginURL = joinAdminPath(adminRoute, loginRoute);
    redirect(`${loginURL}?redirect=${encodeURIComponent(destination)}`);
  }

  if (!canManageEPaper({ req: { user } } as never)) {
    redirect(joinAdminPath(adminRoute, unauthorizedRoute));
  }

  return <>{children}</>;
}