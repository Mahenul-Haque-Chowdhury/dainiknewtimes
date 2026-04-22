import type { Access } from "payload";

type UserRole = "admin" | "editor" | "reporter";

interface AccessUser {
  id?: number | string;
  role?: UserRole;
}

function getUser(input: unknown): AccessUser | null {
  if (!input || typeof input !== "object") return null;
  return input as AccessUser;
}

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user);

export const isAdmin: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  return currentUser?.role === "admin";
};

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  return currentUser?.role === "admin" || currentUser?.role === "editor";
};

export const canCreateArticle: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  if (!currentUser) return false;

  return (
    currentUser.role === "admin" ||
    currentUser.role === "editor" ||
    currentUser.role === "reporter"
  );
};

export const canUpdateDeleteArticle: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  if (!currentUser?.id) return false;

  if (currentUser.role === "admin" || currentUser.role === "editor") {
    return true;
  }

  if (currentUser.role === "reporter") {
    return {
      reporter: {
        equals: currentUser.id,
      },
    };
  }

  return false;
};

export const selfOrAdminAccess: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  if (!currentUser?.id) return false;

  if (currentUser.role === "admin") {
    return true;
  }

  return {
    id: {
      equals: currentUser.id,
    },
  };
};

export const mediaUpdateDeleteAccess: Access = ({ req: { user } }) => {
  const currentUser = getUser(user);
  if (!currentUser) return false;

  if (currentUser.role === "admin" || currentUser.role === "editor") {
    return true;
  }

  return false;
};
