"use server";

import config from "@payload-config";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "./importMap.js";

export const serverFunctionHandler = async (args: any) => {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};
