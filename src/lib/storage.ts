import fs from "fs";
import path from "path";
import os from "os";
import { Project, Booking } from "@/types/portfolio";
import { INITIAL_PROJECTS, INITIAL_BOOKINGS } from "@/data/initial-projects";

// Hỗ trợ lưu trữ linh hoạt: Local JSON trong thư mục data/ khi chạy local,
// và tự động fallback sang os.tmpdir() + bộ nhớ RAM khi chạy trên Serverless (Vercel)
const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "giahuy-portfolio-data");

declare global {
  // eslint-disable-next-line no-var
  var __PORTFOLIO_PROJECTS__: Project[] | undefined;
  // eslint-disable-next-line no-var
  var __PORTFOLIO_BOOKINGS__: Booking[] | undefined;
}

function getWritableDataDir(): string | null {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const testFile = path.join(LOCAL_DATA_DIR, ".write-test");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return LOCAL_DATA_DIR;
  } catch {
    try {
      if (!fs.existsSync(TMP_DATA_DIR)) {
        fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
      }
      return TMP_DATA_DIR;
    } catch {
      return null;
    }
  }
}

export function getProjects(): Project[] {
  const dir = getWritableDataDir();
  if (dir) {
    const filePath = path.join(dir, "projects.json");
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw) as Project[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          global.__PORTFOLIO_PROJECTS__ = parsed;
          return parsed;
        }
      } catch (err) {
        console.warn("[LOG LƯU TRỮ] Không thể đọc projects.json, sử dụng dữ liệu khởi tạo:", err);
      }
    } else {
      try {
        fs.writeFileSync(filePath, JSON.stringify(INITIAL_PROJECTS, null, 2), "utf-8");
      } catch {
        // Ignore write error on read-only fs
      }
    }
  }

  if (!global.__PORTFOLIO_PROJECTS__) {
    global.__PORTFOLIO_PROJECTS__ = [...INITIAL_PROJECTS];
  }
  return global.__PORTFOLIO_PROJECTS__;
}

export function saveProjects(projects: Project[]): Project[] {
  global.__PORTFOLIO_PROJECTS__ = projects;
  const dir = getWritableDataDir();
  if (dir) {
    try {
      const filePath = path.join(dir, "projects.json");
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf-8");
    } catch (err) {
      console.warn("[LOG LƯU TRỮ] Ghi file projects.json thất bại, đã lưu trong bộ nhớ:", err);
    }
  }
  return projects;
}

export function getBookings(): Booking[] {
  const dir = getWritableDataDir();
  if (dir) {
    const filePath = path.join(dir, "bookings.json");
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw) as Booking[];
        if (Array.isArray(parsed)) {
          global.__PORTFOLIO_BOOKINGS__ = parsed;
          return parsed;
        }
      } catch {
        // fallback
      }
    } else {
      try {
        fs.writeFileSync(filePath, JSON.stringify(INITIAL_BOOKINGS, null, 2), "utf-8");
      } catch {
        // Ignore
      }
    }
  }

  if (!global.__PORTFOLIO_BOOKINGS__) {
    global.__PORTFOLIO_BOOKINGS__ = [...INITIAL_BOOKINGS];
  }
  return global.__PORTFOLIO_BOOKINGS__;
}

export function saveBookings(bookings: Booking[]): Booking[] {
  global.__PORTFOLIO_BOOKINGS__ = bookings;
  const dir = getWritableDataDir();
  if (dir) {
    try {
      const filePath = path.join(dir, "bookings.json");
      fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2), "utf-8");
    } catch {
      // Ignore
    }
  }
  return bookings;
}
