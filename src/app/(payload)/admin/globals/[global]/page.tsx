import type { Metadata } from "next";
import { notFound } from "next/navigation";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";

import { importMap } from "../../importMap.js";

const allowedGlobals = new Set(["site-settings", "headlines", "breaking-news"]);

type Params = {
  global: string;
};

type SearchParams = Record<string, string | string[]>;

type Args = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

async function getSegments(paramsPromise: Promise<Params>) {
  const params = await paramsPromise;

  if (!allowedGlobals.has(params.global)) {
    notFound();
  }

  return { segments: ["globals", params.global] };
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({
    config,
    params: Promise.resolve(await getSegments(params)),
    searchParams,
  });

const Page = async ({ params, searchParams }: Args) =>
  RootPage({
    config,
    params: Promise.resolve(await getSegments(params)),
    searchParams,
    importMap,
  });

export default Page;