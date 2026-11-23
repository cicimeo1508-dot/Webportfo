import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthorizedAdminIp } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { allowed } = isAuthorizedAdminIp(request.headers, request.ip);
  if (!allowed) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file tải lên." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Thử lưu vào public/uploads khi chạy local
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      console.log(`[LOG UPLOAD] Đã lưu file tải lên vào /uploads/${safeName}`);
      return NextResponse.json({
        url: `/uploads/${safeName}`,
        filename: safeName,
      });
    } catch {
      // Fallback sang Data URL nếu môi trường Serverless không cho ghi vào public/
      const mimeType = file.type || "application/octet-stream";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      console.log(`[LOG UPLOAD] Đã chuyển đổi file ${safeName} sang Data URL trên môi trường Serverless`);
      return NextResponse.json({
        url: dataUrl,
        filename: safeName,
      });
    }
  } catch (error) {
    console.error("[LOG LỖI UPLOAD] Lỗi khi tải file:", error);
    return NextResponse.json(
      { error: "Tải file thất bại." },
      { status: 500 }
    );
  }
}
