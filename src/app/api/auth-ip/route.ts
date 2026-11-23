import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminIp, SITE_CONFIG } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { allowed, detectedIp } = isAuthorizedAdminIp(
    request.headers,
    request.ip
  );

  return NextResponse.json({
    isAdmin: allowed,
    detectedIp,
    allowedAdminIp: SITE_CONFIG.allowedAdminIp,
  });
}
