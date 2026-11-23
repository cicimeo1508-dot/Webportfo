import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".webm":
      return "video/webm";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function findFileInDirUnicodeSafe(dir: string, targetName: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const directPath = path.join(dir, targetName);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  // So sánh chuẩn hóa Unicode NFC / NFD (tránh lỗi dấu tiếng Việt tổ hợp vs dựng sẵn trên macOS/Windows)
  const targetNfc = targetName.normalize("NFC").toLowerCase();
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.normalize("NFC").toLowerCase() === targetNfc) {
        const full = path.join(dir, entry);
        if (fs.statSync(full).isFile()) return full;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function resolveMediaPath(segments: string[]): string | null {
  const safeSegments = segments.map((s) => path.basename(decodeURIComponent(s)));

  // 1. Ưu tiên tìm trong f:\AI\public\uploads (bao gồm thư mục con port-stills)
  const uploadsPath = path.join(process.cwd(), "public", "uploads", ...safeSegments);
  if (fs.existsSync(uploadsPath) && fs.statSync(uploadsPath).isFile()) {
    return uploadsPath;
  }

  const lastSegment = safeSegments[safeSegments.length - 1];
  if (!lastSegment) return null;

  // 2. Hỗ trợ đọc trực tiếp từ I:\PORT và I:\PORT\THEM (hỗ trợ cả Unicode NFC & NFD)
  const fromPort = findFileInDirUnicodeSafe("I:\\PORT", lastSegment);
  if (fromPort) return fromPort;

  const fromPortThem = findFileInDirUnicodeSafe("I:\\PORT\\THEM", lastSegment);
  if (fromPortThem) return fromPortThem;

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const segments = params.path || [];
    const filePath = resolveMediaPath(segments);

    if (!filePath) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const mimeType = getMimeType(filePath);
    const range = request.headers.get("range");

    // Hỗ trợ HTTP 206 Byte-Range Streaming cho file Video dung lượng lớn (100MB - 1GB+)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const nodeStream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(nodeStream) as ReadableStream;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const nodeStream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Length": String(fileSize),
        "Content-Type": mimeType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[LOG LỖI MEDIA STREAM] Không thể đọc file media:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
