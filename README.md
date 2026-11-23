# Gia Huy — Senior Video Editor & D.O.P Portfolio (Apple OS 26 Liquid Glass)

Website Portfolio chính thức của **Gia Huy** (`editor.cicimeo@gmail.com` | `0357 933 106`), được thiết kế theo ngôn ngữ **Apple visionOS / macOS / iOS 26 Liquid Glass & Spatial Minimalism**.

## ✨ Tính năng nổi bật
- **Apple OS 26 Liquid Glass UI/UX:** Hiệu ứng kính mờ đa lớp (`backdrop-filter: blur(24px) saturate(180%)`), chuyển đổi mượt mà giữa **Light Mode** (`#F5F5F7`) và **Dark Mode** (`#000000` / `#1C1C1E`).
- **Hero Section 3D Spatial:** Chân dung tách phông chính giữa kết hợp 5 thẻ kính nổi 3D (**Adobe Premiere Pro, After Effects, DaVinci Resolve, Photoshop, Lightroom**) chuyển động vật lý (Framer Motion Parallax).
- **Bento Portfolio Showcase & Apple Modal:** 6 dự án mẫu chuẩn tỉ lệ `16:9` và `9:16`, tự động phát video preview khi di chuột và mở Modal 4K kèm bộ sưu tập hình ảnh hậu trường (Stills/BTS).
- **Trang Đặt Lịch (`/booking`):** Tích hợp lịch `react-day-picker` tùy biến giao diện kính mờ Apple OS 26, chọn ngày và khung giờ trống trực quan.
- **Trang Quản Trị Bí Mật Theo IP (`/admin`):** Bảo mật 2 lớp (Edge Middleware + Server Component) chỉ cho phép duy nhất địa chỉ IP `14.179.237.172` truy cập. Mọi IP khác đều tự động nhận trang `404` chuẩn.

## 🚀 Khởi chạy dự án
```bash
npm install
npm run dev
```

## 🧪 Kiểm thử tự động (Auto-Revision)
```bash
node scripts/auto-test-suite.mjs
node scripts/headless-viewport-check.mjs
```
