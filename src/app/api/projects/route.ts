import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/storage";
import { isAuthorizedAdminIp } from "@/lib/config";
import { Project, SoftwareCode } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const { allowed, detectedIp } = isAuthorizedAdminIp(
    request.headers,
    request.ip
  );
  if (!allowed) {
    console.warn(`[LOG BẢO MẬT API] Từ chối thêm dự án từ IP: ${detectedIp}`);
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const {
      title,
      client,
      year,
      category,
      aspectRatio,
      featured,
      description,
      thumbnailUrl,
      videoUrl,
      gallery,
      deliverables,
      softwareUsed,
    } = body;

    if (!client || !title) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Tên dự án và Tên khách hàng." },
        { status: 400 }
      );
    }

    const projects = getProjects();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: String(title).trim(),
      client: String(client).trim(),
      year: String(year || new Date().getFullYear()).trim(),
      category: String(category || "TVC Thương Mại").trim(),
      aspectRatio: aspectRatio === "9:16" ? "9:16" : "16:9",
      featured: Boolean(featured),
      description: String(description || "").trim(),
      thumbnailUrl:
        String(thumbnailUrl || "").trim() ||
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=85",
      videoUrl:
        String(videoUrl || "").trim() ||
        "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-in-the-city-at-night-41566-large.mp4",
      gallery: Array.isArray(gallery) && gallery.length > 0
        ? gallery.filter(Boolean)
        : [
            String(thumbnailUrl || "").trim() ||
              "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=85",
          ],
      deliverables:
        Array.isArray(deliverables) && deliverables.length > 0
          ? deliverables
          : ["4K Master", "Color Grading"],
      softwareUsed:
        Array.isArray(softwareUsed) && softwareUsed.length > 0
          ? (softwareUsed as SoftwareCode[])
          : ["Pr", "Ae", "Dv"],
      createdAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    console.log(`[LOG HỆ THỐNG] Đã thêm dự án mới: "${newProject.title}" (${newProject.client})`);

    return NextResponse.json({ project: newProject, projects: updated }, { status: 201 });
  } catch (error) {
    console.error("[LOG LỖI API] Lỗi khi tạo dự án mới:", error);
    return NextResponse.json(
      { error: "Không thể tạo dự án mới. Vui lòng kiểm tra dữ liệu đầu vào." },
      { status: 500 }
    );
  }
}
