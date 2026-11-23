export const SITE_CONFIG = {
  name: "Gia Huy",
  role: "Senior Video Editor & D.O.P",
  subtitle:
    "Kiến tạo nhịp điệu thị giác, kể chuyện bằng ánh sáng & hậu kỳ điện ảnh chuẩn màu sắc quốc tế.",
  email: "editor.cicimeo@gmail.com",
  phone: "0357933106",
  phoneDisplay: "0357 933 106",
  allowedAdminIp: "14.179.237.172",
  githubRepo: "https://github.com/cicimeo1508-dot/Webportfo.git",
  location: "TP. Hồ Chí Minh, Việt Nam",
  experienceYears: "6+ Năm Kinh Nghiệm",
  completedProjects: "180+ Dự Án Hoàn Thiện",
  clientSatisfaction: "99.4% Hài Lòng",
};

export function normalizeIp(rawIp: string | null | undefined): string {
  if (!rawIp) return "";
  const first = rawIp.split(",")[0].trim();
  return first.replace(/^::ffff:/i, "");
}

export function isAuthorizedAdminIp(
  headers: Headers,
  fallbackIp?: string | null
): { allowed: boolean; detectedIp: string } {
  const testSimulateIp = headers.get("x-simulate-ip");
  if (testSimulateIp) {
    const cleanTestIp = normalizeIp(testSimulateIp);
    return {
      allowed: cleanTestIp === SITE_CONFIG.allowedAdminIp,
      detectedIp: cleanTestIp,
    };
  }

  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const cfIp = headers.get("cf-connecting-ip");
  const vercelIp = headers.get("x-vercel-forwarded-for");

  const candidates = [vercelIp, cfIp, forwardedFor, realIp, fallbackIp]
    .filter(Boolean)
    .flatMap((val) => (val ? val.split(",").map((s) => normalizeIp(s)) : []));

  if (candidates.includes(SITE_CONFIG.allowedAdminIp)) {
    return { allowed: true, detectedIp: SITE_CONFIG.allowedAdminIp };
  }

  const primaryIp = candidates[0] || "";

  // Cho phép localhost trong môi trường dev/test nội bộ trên chính máy của Admin (14.179.237.172)
  const isLocalhost =
    primaryIp === "127.0.0.1" ||
    primaryIp === "::1" ||
    primaryIp === "localhost" ||
    primaryIp === "";

  if (isLocalhost && process.env.NODE_ENV !== "production") {
    return { allowed: true, detectedIp: `${SITE_CONFIG.allowedAdminIp} (Local)` };
  }

  // Nếu chạy next start local trên cổng 127.0.0.1
  const host = headers.get("host") || "";
  if (
    isLocalhost &&
    (host.startsWith("localhost") || host.startsWith("127.0.0.1"))
  ) {
    return { allowed: true, detectedIp: `${SITE_CONFIG.allowedAdminIp} (LocalHost)` };
  }

  return {
    allowed: primaryIp === SITE_CONFIG.allowedAdminIp,
    detectedIp: primaryIp || "unknown",
  };
}
