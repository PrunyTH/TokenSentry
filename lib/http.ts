import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export function getRequestIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function enforceRateLimit(req: NextRequest) {
  const ip = getRequestIp(req);
  const status = await checkRateLimit(ip);
  if (!status.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please retry in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(status.retryAfter),
        },
      }
    );
  }
  return null;
}
