import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const FFMPEG = "C:\\Program Files\\AutoSub Typo for CapCut\\resources\\tools\\ffmpeg\\ffmpeg.exe";
const PORT_DIR = "I:\\PORT";
const OUT_BASE = "f:\\AI\\public\\uploads\\port-stills";

const SLUG_MAP = {
  "94Farm - Anh Duy.mp4": "94farm-anh-duy",
  "BAR THE BLACK - ANH DƯƠNG.mp4": "bar-the-black-anh-duong",
  "BOHO - RESTAURANT.mp4": "boho-restaurant",
  "CỬU HỶ - CHỊ NHƯ.mp4": "cuu-hy-chi-nhu",
  "HLW PARTY - ADM.mp4": "hlw-party-adm",
  "KTT- BẠC.mp4": "ktt-bac",
  "MEXO - ANH Trọng.mp4": "mexo-anh-trong",
  "QUICK FISH - ANH HUY.mp4": "quick-fish-anh-huy",
  "TMV - THANH HƯƠNG.mp4": "tmv-thanh-huong",
  "VISUAL LED -ADM.mp4": "visual-led-adm",
};

function probeVideo(filePath) {
  let stderr = "";
  try {
    execFileSync(FFMPEG, ["-i", filePath], { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    stderr = e.stderr ? e.stderr.toString("utf8") : "";
  }

  // Parse Duration: 00:00:45.12
  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  let durationSec = 30;
  if (durMatch) {
    durationSec =
      parseInt(durMatch[1], 10) * 3600 +
      parseInt(durMatch[2], 10) * 60 +
      parseFloat(durMatch[3]);
  }

  // Parse Video stream resolution: 1920x1080 or 1080x1920
  const resMatch = stderr.match(/Stream #.*Video:.*?\s(\d{3,5})x(\d{3,5})/);
  let width = 1920;
  let height = 1080;
  if (resMatch) {
    width = parseInt(resMatch[1], 10);
    height = parseInt(resMatch[2], 10);
  }

  // Check rotation metadata if any
  const rotMatch = stderr.match(/rotate\s*:\s*(\d+)/) || stderr.match(/rotation of (-?\d+)/);
  if (rotMatch) {
    const angle = Math.abs(parseInt(rotMatch[1], 10));
    if (angle === 90 || angle === 270) {
      const tmp = width;
      width = height;
      height = tmp;
    }
  }

  const aspectRatio = height > width ? "9:16" : "16:9";
  return { durationSec, width, height, aspectRatio };
}

async function main() {
  if (!fs.existsSync(OUT_BASE)) {
    fs.mkdirSync(OUT_BASE, { recursive: true });
  }

  const files = fs.readdirSync(PORT_DIR).filter((f) => f.toLowerCase().endsWith(".mp4"));
  const report = [];

  for (const file of files) {
    const fullPath = path.join(PORT_DIR, file);
    const slug = SLUG_MAP[file] || file.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const outDir = path.join(OUT_BASE, slug);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const info = probeVideo(fullPath);
    console.log(
      `\x1b[36m[LOG PHÂN TÍCH VIDEO] ${file} -> Độ phân giải: ${info.width}x${info.height} (${info.aspectRatio}), Thời lượng: ${info.durationSec.toFixed(1)}s\x1b[0m`
    );

    // Trích xuất 6 khung hình ứng viên trải đều theo thời lượng video
    const percentages = [0.12, 0.27, 0.42, 0.57, 0.72, 0.86];
    const extractedFrames = [];

    for (let i = 0; i < percentages.length; i++) {
      const ts = Math.max(0.5, info.durationSec * percentages[i]).toFixed(2);
      const frameName = `frame-${i + 1}.jpg`;
      const framePath = path.join(outDir, frameName);

      execFileSync(
        FFMPEG,
        [
          "-y",
          "-ss",
          ts,
          "-i",
          fullPath,
          "-frames:v",
          "1",
          "-vf",
          "scale='min(1280,iw)':-2",
          "-q:v",
          "3",
          framePath,
        ],
        { stdio: "ignore" }
      );
      extractedFrames.push(`/uploads/port-stills/${slug}/${frameName}`);
    }

    // Tạo Contact Sheet 3x2 để AI kiểm tra trực quan và chọn khung hình đặc sắc nhất
    const contactSheetPath = path.join(outDir, "contact-sheet.jpg");
    execFileSync(
      FFMPEG,
      [
        "-y",
        "-i",
        path.join(outDir, "frame-1.jpg"),
        "-i",
        path.join(outDir, "frame-2.jpg"),
        "-i",
        path.join(outDir, "frame-3.jpg"),
        "-i",
        path.join(outDir, "frame-4.jpg"),
        "-i",
        path.join(outDir, "frame-5.jpg"),
        "-i",
        path.join(outDir, "frame-6.jpg"),
        "-filter_complex",
        "[0:v]scale=480:-2[v0];[1:v]scale=480:-2[v1];[2:v]scale=480:-2[v2];[3:v]scale=480:-2[v3];[4:v]scale=480:-2[v4];[5:v]scale=480:-2[v5];[v0][v1][v2]hstack=inputs=3[top];[v3][v4][v5]hstack=inputs=3[bot];[top][bot]vstack=inputs=2",
        "-q:v",
        "4",
        contactSheetPath,
      ],
      { stdio: "ignore" }
    );

    console.log(
      `\x1b[32m[LOG TRÍCH XUẤT HIGHLIGHT] Đã cắt 6 khung hình chất lượng cao cho "${file}" tại ${outDir}\x1b[0m`
    );

    report.push({
      file,
      slug,
      ...info,
      frames: extractedFrames,
      contactSheetPath,
    });
  }

  fs.writeFileSync(
    path.join(OUT_BASE, "report.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );
  console.log("\x1b[32m[LOG HOÀN TẤT] Đã trích xuất xong toàn bộ khung hình ứng viên từ 10 video trong I:\\PORT!\x1b[0m");
}

main().catch((err) => {
  console.error("[LOG LỖI]", err);
  process.exit(1);
});
