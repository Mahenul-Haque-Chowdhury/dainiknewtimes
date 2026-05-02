import React from "react";

type Args = {
  children: React.ReactNode;
};

export default function Layout({ children }: Args) {
  return <>{children}</>;
}
