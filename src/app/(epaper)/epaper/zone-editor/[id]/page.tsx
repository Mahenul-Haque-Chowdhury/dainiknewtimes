import { redirect } from "next/navigation";

export default async function LegacyZoneEditorRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/zone-editor/${id}`);
}
