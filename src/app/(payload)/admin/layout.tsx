import config from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import { importMap } from "./importMap.js";
import { serverFunctionHandler } from "./serverFunctions";

import "./[[...segments]]/layout.css";

type Args = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Admin - দৈনিক নিউ টাইমস",
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunctionHandler}>
      {children}
    </RootLayout>
  );
}