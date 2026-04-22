import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload-helpers";

export async function GET() {
  try {
    const payload = await getPayloadClient();

    await payload.find({
      collection: "categories",
      limit: 1,
      depth: 0,
    });

    return NextResponse.json(
      {
        status: "ready",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "not-ready",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown readiness error",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
