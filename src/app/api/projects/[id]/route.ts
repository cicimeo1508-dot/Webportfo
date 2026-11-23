import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/storage";
import { isAuthorizedAdminIp } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { allowed } = isAuthorizedAdminIp(request.headers, request.ip);
  if (!allowed) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const projects = getProjects();
    const idx = projects.findIndex((p) => p.id === params.id);

    if (idx === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy dự án cần chỉnh sửa." },
        { status: 404 }
      );
    }

    const existing = projects[idx];
    const updatedProject = {
      ...existing,
      ...body,
      id: existing.id,
      aspectRatio:
        body.aspectRatio === "9:16"
          ? ("9:16" as const)
          : body.aspectRatio === "16:9"
          ? ("16:9" as const)
          : existing.aspectRatio,
    };

    const updatedList = [...projects];
    updatedList[idx] = updatedProject;
    saveProjects(updatedList);
    console.log(`[LOG HỆ THỐNG] Đã cập nhật dự án ID=${params.id}: "${updatedProject.title}"`);

    return NextResponse.json({
      project: updatedProject,
      projects: updatedList,
    });
  } catch (error) {
    console.error("[LOG LỖI API] Lỗi khi cập nhật dự án:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật dự án." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { allowed } = isAuthorizedAdminIp(request.headers, request.ip);
  if (!allowed) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const projects = getProjects();
  const exists = projects.some((p) => p.id === params.id);
  if (!exists) {
    return NextResponse.json(
      { error: "Không tìm thấy dự án cần xóa." },
      { status: 404 }
    );
  }

  const updatedList = projects.filter((p) => p.id !== params.id);
  saveProjects(updatedList);
  console.log(`[LOG HỆ THỐNG] Đã xóa dự án ID=${params.id}`);

  return NextResponse.json({ projects: updatedList });
}
