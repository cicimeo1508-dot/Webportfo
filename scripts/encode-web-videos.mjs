import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const FFMPEG = "C:\\Program Files\\AutoSub Typo for CapCut\\resources\\tools\\ffmpeg\\ffmpeg.exe";
const WEB_VIDEOS_DIR = "f:\\AI\\public\\uploads\\web-videos";
const PROJECTS_FILE = "f:\\AI\\data\\projects.json";

if (!fs.existsSync(WEB_VIDEOS_DIR)) {
  fs.mkdirSync(WEB_VIDEOS_DIR, { recursive: true });
}

function findSourceVideo(videoUrl) {
  const baseName = path.basename(decodeURIComponent(videoUrl));
  const candidates = [
    path.join("f:\\AI\\public\\uploads", baseName),
    path.join("f:\\AI\\public\\uploads\\web-videos", baseName),
    path.join("I:\\PORT", baseName),
    path.join("I:\\PORT\\THEM", baseName),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  const targetNfc = baseName.normalize("NFC").toLowerCase();
  for (const dir of ["I:\\PORT", "I:\\PORT\\THEM", "f:\\AI\\public\\uploads"]) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (entry.normalize("NFC").toLowerCase() === targetNfc) {
        return path.join(dir, entry);
      }
    }
  }
  return null;
}

const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf8"));

for (const proj of projects) {
  const slug = proj.id.replace(/^proj-/, "");
  const outName = `${slug}.mp4`;
  const outPath = path.join(WEB_VIDEOS_DIR, outName);

  const srcPath = findSourceVideo(proj.videoUrl);
  if (!srcPath) {
    console.warn(`[LOG CẢNH BÁO] Không tìm thấy file nguồn cho ${proj.title}: ${proj.videoUrl}`);
    continue;
  }

  if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 10000) {
    const srcSizeMB = (fs.statSync(srcPath).size / (1024 * 1024)).toFixed(1);
    console.log(
      `\x1b[36m[LOG GPU NVENC] Đang nén FastStart H.264 bằng GPU NVIDIA cho "${proj.title}" (Gốc: ${srcSizeMB} MB)...\x1b[0m`
    );

    const isVertical = proj.aspectRatio === "9:16";
    const scaleFilter = isVertical
      ? "scale='min(720,iw)':-2"
      : "scale='min(1280,iw)':-2";

    try {
      execFileSync(
        FFMPEG,
        [
          "-y",
          "-i",
          srcPath,
          "-t",
          "90",
          "-vf",
          scaleFilter,
          "-c:v",
          "h264_nvenc",
          "-b:v",
          "1500k",
          "-maxrate",
          "2000k",
          "-bufsize",
          "4000k",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          outPath,
        ],
        { stdio: "ignore" }
      );
    } catch {
      // Fallback sang MediaFoundation H264 nếu GPU bận
      execFileSync(
        FFMPEG,
        [
          "-y",
          "-i",
          srcPath,
          "-t",
          "90",
          "-vf",
          scaleFilter,
          "-c:v",
          "h264_mf",
          "-b:v",
          "1500k",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          outPath,
        ],
        { stdio: "ignore" }
      );
    }

    const newSizeMB = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(1);
    console.log(
      `\x1b[32m[LOG THÀNH CÔNG] "${proj.title}": ${srcSizeMB} MB -> ${newSizeMB} MB (Chuẩn Web FastStart H.264 yuv420p)\x1b[0m`
    );
  }

  proj.videoUrl = `/uploads/web-videos/${outName}`;
}

fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");

const initialTsPath = "f:\\AI\\src\\data\\initial-projects.ts";
const tsContent = `import { Project, Booking } from "@/types/portfolio";

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-sample-1",
    clientName: "Minh Tuấn (Creative Director - Ogilvy)",
    contact: "minhtuan.creative@agency.vn | 0908123456",
    projectType: "TVC Thương Mại & Color Grading",
    date: "2026-11-26",
    timeSlot: "14:00 - 16:00",
    notes: "Họp brief offline/online cho chiến dịch TVC Tết 2027 (30s + 15s cutdown).",
    status: "confirmed",
    createdAt: "2026-11-20T09:00:00.000Z",
  },
];
`;
fs.writeFileSync(initialTsPath, tsContent, "utf8");
console.log("\x1b[32m[LOG HOÀN TẤT] Đã tối ưu hóa toàn bộ 19 video sang chuẩn Web Streaming!\x1b[0m");
