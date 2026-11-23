import { NextRequest, NextResponse } from "next/server";
import { getClientLinks, saveClientLinks } from "@/lib/storage";
import { isAuthorizedAdminIp } from "@/lib/config";
import { ClientShareLink } from "@/types/portfolio";

export const dynamic = "force-dynamic";

function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const links = getClientLinks();
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const { allowed } = isAuthorizedAdminIp(request.headers, request.ip);
  if (!allowed) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { slug, clientName, customTitle, welcomeMessage, projectIds } = body;

    const cleanSlug = sanitizeSlug(String(slug || clientName || ""));
    if (!cleanSlug || !clientName) {
      return NextResponse.json(
        { error: "Vui lòng nhập Đường dẫn (Slug) và Tên khách hàng." },
        { status: 400 }
      );
    }

    const links = getClientLinks();
    const existingIdx = links.findIndex((l) => l.slug === cleanSlug);

    const newLink: ClientShareLink = {
      id: existingIdx >= 0 ? links[existingIdx].id : `cl-${Date.now()}`,
      slug: cleanSlug,
      clientName: String(clientName).trim(),
      customTitle:
        String(customTitle || "").trim() ||
        `Showreel Chọn Lọc Dành Riêng Cho ${String(clientName).trim()}`,
      welcomeMessage:
        String(welcomeMessage || "").trim() ||
        `Chào ${String(clientName).trim()}, dưới đây là các dự án video được Gia Huy tuyển chọn riêng phù hợp với định hướng hình ảnh của bạn.`,
      projectIds: Array.isArray(projectIds) ? projectIds : [],
      createdAt: new Date().toISOString(),
    };

    let updated: ClientShareLink[];
    if (existingIdx >= 0) {
      updated = [...links];
      updated[existingIdx] = newLink;
    } else {
      updated = [newLink, ...links];
    }

    saveClientLinks(updated);
    console.log(`[LOG CUSTOM LINK] Đã lưu đường dẫn khách hàng: /vip/${newLink.slug}`);

    return NextResponse.json({ link: newLink, links: updated }, { status: 201 });
  } catch (error) {
    console.error("[LOG LỖI API] Lỗi khi tạo link custom:", error);
    return NextResponse.json(
      { error: "Không thể tạo đường dẫn custom." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { allowed } = isAuthorizedAdminIp(request.headers, request.ip);
  if (!allowed) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Thiếu tham số slug" }, { status: 400 });
  }

  const links = getClientLinks();
  const updated = links.filter((l) => l.slug !== slug);
  saveClientLinks(updated);
  return NextResponse.json({ links: updated });
}
