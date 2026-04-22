import { describe, expect, it } from "vitest";

import {
  canCreateArticle,
  canUpdateDeleteArticle,
  isAdmin,
  isAdminOrEditor,
  mediaUpdateDeleteAccess,
  selfOrAdminAccess,
} from "@/lib/access";

function runAccess(accessFn: any, user: any) {
  return accessFn({ req: { user } });
}

describe("access helpers", () => {
  it("checks admin role", () => {
    expect(runAccess(isAdmin, { role: "admin" })).toBe(true);
    expect(runAccess(isAdmin, { role: "editor" })).toBe(false);
  });

  it("checks admin/editor role", () => {
    expect(runAccess(isAdminOrEditor, { role: "admin" })).toBe(true);
    expect(runAccess(isAdminOrEditor, { role: "editor" })).toBe(true);
    expect(runAccess(isAdminOrEditor, { role: "reporter" })).toBe(false);
  });

  it("allows reporter article creation but constrains updates to own records", () => {
    expect(runAccess(canCreateArticle, { role: "reporter" })).toBe(true);
    expect(runAccess(canUpdateDeleteArticle, { role: "reporter", id: 7 })).toEqual({
      reporter: { equals: 7 },
    });
  });

  it("enforces self/admin user access", () => {
    expect(runAccess(selfOrAdminAccess, { role: "admin", id: 1 })).toBe(true);
    expect(runAccess(selfOrAdminAccess, { role: "reporter", id: 7 })).toEqual({
      id: { equals: 7 },
    });
  });

  it("allows reporter to manage only owned media", () => {
    expect(runAccess(mediaUpdateDeleteAccess, { role: "reporter", id: "u1" })).toBe(false);
  });
});
