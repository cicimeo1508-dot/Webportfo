import fs from "fs";
import path from "path";
import os from "os";
import { Project, Booking, ClientShareLink } from "@/types/portfolio";
import { INITIAL_PROJECTS, INITIAL_BOOKINGS } from "@/data/initial-projects";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "giahuy-portfolio-data");

export const INITIAL_CLIENT_LINKS: ClientShareLink[] = [
  {
    id: "cl-fnb-showcase",
    slug: "am-thuc-nha-hang",
    clientName: "Quý Đối Tác F&B / Nhà Hàng",
    customTitle: "Showreel Ẩm Thực & Nhà Hàng Chọn Lọc — Gia Huy D.O.P",
    welcomeMessage:
      "Chào anh/chị, đây là danh sách các dự án video Ẩm thực, Nhà hàng & Rooftop Dining do Gia Huy trực tiếp đảm nhận quay dựng và chỉnh màu. Mời anh/chị bấm vào từng dự án để xem bản Master chất lượng cao và các phân cảnh Highlight.",
    projectIds: [
      "proj-cccp-nha-hang-anh-long",
      "proj-vuon-mong-mo-anh-thien",
      "proj-nanimo-restaurant-chi-kim-anh",
      "proj-france-restaurant-jason",
      "proj-94farm-anh-duy",
      "proj-cuu-hy-chi-nhu",
      "proj-boho-restaurant",
    ],
    createdAt: "2026-11-23T11:30:00.000Z",
  },
  {
    id: "cl-nightlife-adm",
    slug: "nightlife-event",
    clientName: "Quý Đối Tác Lounge & Event",
    customTitle: "Showreel Nightlife, Visual LED & Sự Kiện 4K — Gia Huy",
    welcomeMessage:
      "Tổng hợp các dự án Visual LED sân khấu lớn, Aftermovie Halloween Party và Nightlife 4K với tiết tấu dựng bắt beat, hiệu ứng VFX chuyển cảnh và chỉnh màu Neon tương phản cao.",
    projectIds: [
      "proj-visual-led-adm",
      "proj-hlw-party-adm",
      "proj-bar-the-black-anh-duong",
    ],
    createdAt: "2026-11-23T11:31:00.000Z",
  },
  {
    id: "cl-talking-head-brand",
    slug: "thuong-hieu-chuyen-gia",
    clientName: "Quý Đối Tác Doanh Nghiệp & Thẩm Mỹ",
    customTitle: "Showreel Talking Head, Thẩm Mỹ & TVC Sản Phẩm — Gia Huy",
    welcomeMessage:
      "Tuyển tập các video xây dựng thương hiệu chuyên gia (Talking Head Motion UI), TVC Trang sức Macro 4K và chuỗi video Thẩm mỹ viện / Bác sĩ giúp tối ưu tỷ lệ giữ chân khách hàng.",
    projectIds: [
      "proj-brief-peter",
      "proj-aquamen-care-center-anh-duong",
      "proj-shop-sp-anh-tien",
      "proj-su-tich-cay-neu-film-anh-thien",
      "proj-mexo-anh-trong",
      "proj-quick-fish-anh-huy",
      "proj-tmv-thanh-huong",
      "proj-ktt-bac",
      "proj-bs-hoang-lan",
    ],
    createdAt: "2026-11-23T11:32:00.000Z",
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __PORTFOLIO_PROJECTS__: Project[] | undefined;
  // eslint-disable-next-line no-var
  var __PORTFOLIO_BOOKINGS__: Booking[] | undefined;
  // eslint-disable-next-line no-var
  var __PORTFOLIO_CLIENT_LINKS__: ClientShareLink[] | undefined;
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
        // Ignore
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
      console.warn("[LOG LƯU TRỮ] Ghi file projects.json thất bại:", err);
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

export function getClientLinks(): ClientShareLink[] {
  const dir = getWritableDataDir();
  if (dir) {
    const filePath = path.join(dir, "client-links.json");
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw) as ClientShareLink[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          global.__PORTFOLIO_CLIENT_LINKS__ = parsed;
          return parsed;
        }
      } catch {
        // fallback
      }
    } else {
      try {
        fs.writeFileSync(filePath, JSON.stringify(INITIAL_CLIENT_LINKS, null, 2), "utf-8");
      } catch {
        // Ignore
      }
    }
  }

  if (!global.__PORTFOLIO_CLIENT_LINKS__) {
    global.__PORTFOLIO_CLIENT_LINKS__ = [...INITIAL_CLIENT_LINKS];
  }
  return global.__PORTFOLIO_CLIENT_LINKS__;
}

export function saveClientLinks(links: ClientShareLink[]): ClientShareLink[] {
  global.__PORTFOLIO_CLIENT_LINKS__ = links;
  const dir = getWritableDataDir();
  if (dir) {
    try {
      const filePath = path.join(dir, "client-links.json");
      fs.writeFileSync(filePath, JSON.stringify(links, null, 2), "utf-8");
    } catch {
      // Ignore
    }
  }
  return links;
}
