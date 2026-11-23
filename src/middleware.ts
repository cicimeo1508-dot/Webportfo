import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminIp } from "@/lib/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const { allowed, detectedIp } = isAuthorizedAdminIp(
      request.headers,
      request.ip
    );

    if (!allowed) {
      console.warn(
        `[LOG BẢO MẬT IP] Chặn truy cập trái phép vào ${pathname} từ IP: ${detectedIp} (Chỉ cho phép 14.179.237.172). Trả về trang 404 chuẩn.`
      );
      // Rewrite sang route 404 chuẩn của hệ thống để ẩn hoàn toàn sự tồn tại của trang /admin
      const url = request.nextUrl.clone();
      url.pathname = "/_not-found-stealth-404";
      return NextResponse.rewrite(url, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
