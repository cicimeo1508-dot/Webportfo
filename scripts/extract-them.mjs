import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const FFMPEG = "C:\\Program Files\\AutoSub Typo for CapCut\\resources\\tools\\ffmpeg\\ffmpeg.exe";
const DIR = "I:\\PORT\\THEM";
const OUT_BASE = "f:\\AI\\public\\uploads\\port-stills";

function toSlug(filename) {
  return filename
    .replace(/\.mp4$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const allFiles = fs
  .readdirSync(DIR)
  .filter((f) => f.toLowerCase().endsWith(".mp4"));

for (const file of allFiles) {
  const slug = toSlug(file);
  const fullPath = path.join(DIR, file);
  const outDir = path.join(OUT_BASE, slug);

  if (fs.existsSync(path.join(outDir, "contact-sheet.jpg"))) {
    console.log(`[LOG BỎ QUA] Đã trích xuất trước đó: ${file} (${slug})`);
    continue;
  }

  fs.mkdirSync(outDir, { recursive: true });

  let stderr = "";
  try {
    execFileSync(FFMPEG, ["-i", fullPath], { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    stderr = e.stderr ? e.stderr.toString("utf8") : "";
  }

  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const durationSec = durMatch
    ? parseInt(durMatch[1], 10) * 3600 +
      parseInt(durMatch[2], 10) * 60 +
      parseFloat(durMatch[3])
    : 30;
  const resMatch = stderr.match(/Stream #.*Video:.*?\s(\d{3,5})x(\d{3,5})/);
  let width = resMatch ? parseInt(resMatch[1], 10) : 1920;
  let height = resMatch ? parseInt(resMatch[2], 10) : 1080;

  const rotMatch =
    stderr.match(/rotate\s*:\s*(\d+)/) || stderr.match(/rotation of (-?\d+)/);
  if (rotMatch) {
    const angle = Math.abs(parseInt(rotMatch[1], 10));
    if (angle === 90 || angle === 270) {
      const tmp = width;
      width = height;
      height = tmp;
    }
  }

  const aspectRatio = height > width ? "9:16" : "16:9";

  console.log(
    `\x1b[36m[LOG PHÂN TÍCH VIDEO MỚI] ${file} (slug: ${slug}) -> Độ phân giải: ${width}x${height} (${aspectRatio}), Thời lượng: ${durationSec.toFixed(1)}s\x1b[0m`
  );

  const pcts = [0.12, 0.27, 0.42, 0.57, 0.72, 0.86];
  for (let i = 0; i < pcts.length; i++) {
    const ts = Math.max(0.5, durationSec * pcts[i]).toFixed(2);
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
        path.join(outDir, `frame-${i + 1}.jpg`),
      ],
      { stdio: "ignore" }
    );
  }

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
      path.join(outDir, "contact-sheet.jpg"),
    ],
    { stdio: "ignore" }
  );
  console.log(
    `\x1b[32m[LOG TRÍCH XUẤT HIGHLIGHT] Đã cắt 6 khung hình chất lượng cao cho "${file}" tại ${outDir}\x1b[0m`
  );
}
