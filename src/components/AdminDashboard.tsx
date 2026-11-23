"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  UploadCloud,
  Film,
  Images,
  CheckCircle2,
  Calendar,
  Building2,
  Save,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Project, Booking, SoftwareCode } from "@/types/portfolio";
import { SITE_CONFIG } from "@/lib/config";
import { SOFTWARE_LIST, SoftwareSvgIcon } from "@/components/SoftwareIcons";

interface AdminDashboardProps {
  initialProjects: Project[];
  initialBookings: Booking[];
  detectedIp: string;
}

const EMPTY_FORM = {
  title: "",
  client: "",
  year: "2026",
  category: "TVC Thương Mại",
  aspectRatio: "16:9" as "16:9" | "9:16",
  featured: false,
  description: "",
  thumbnailUrl: "",
  videoUrl: "",
  galleryText: "",
  deliverablesText: "4K Master, ACES Color Grading, Sound Design",
  softwareUsed: ["Pr", "Ae", "Dv"] as SoftwareCode[],
};

export function AdminDashboard({
  initialProjects,
  initialBookings,
  detectedIp,
}: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [bookings] = useState<Booking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<"projects" | "editor" | "bookings">(
    "projects"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setActiveTab("editor");
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      client: project.client,
      year: project.year,
      category: project.category,
      aspectRatio: project.aspectRatio,
      featured: Boolean(project.featured),
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      videoUrl: project.videoUrl,
      galleryText: (project.gallery || []).join("\n"),
      deliverablesText: (project.deliverables || []).join(", "),
      softwareUsed: project.softwareUsed || ["Pr", "Ae"],
    });
    setActiveTab("editor");
  };

  const handleToggleSoftware = (code: SoftwareCode) => {
    setForm((prev) => {
      const exists = prev.softwareUsed.includes(code);
      if (exists) {
        return {
          ...prev,
          softwareUsed: prev.softwareUsed.filter((c) => c !== code),
        };
      }
      return { ...prev, softwareUsed: [...prev.softwareUsed, code] };
    });
  };

  const handleFileUpload = async (
    file: File,
    target: "thumbnailUrl" | "videoUrl" | "gallery"
  ) => {
    setUploadingField(target);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (target === "gallery") {
          setForm((prev) => ({
            ...prev,
            galleryText: prev.galleryText
              ? `${prev.galleryText}\n${data.url}`
              : data.url,
          }));
        } else {
          setForm((prev) => ({ ...prev, [target]: data.url }));
        }
        showToast(`Đã tải lên thành công: ${file.name}`);
      } else {
        showToast(data.error || "Không thể tải file lên.");
      }
    } catch {
      showToast("Lỗi kết nối khi tải file.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.client.trim()) {
      showToast("Vui lòng nhập đầy đủ Tên dự án và Tên khách hàng.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: form.title.trim(),
      client: form.client.trim(),
      year: form.year.trim() || "2026",
      category: form.category.trim() || "TVC Thương Mại",
      aspectRatio: form.aspectRatio,
      featured: form.featured,
      description: form.description.trim(),
      thumbnailUrl:
        form.thumbnailUrl.trim() ||
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85",
      videoUrl:
        form.videoUrl.trim() ||
        "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-in-the-city-at-night-41566-large.mp4",
      gallery: form.galleryText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      deliverables: form.deliverablesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      softwareUsed: form.softwareUsed,
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
        showToast(
          editingId
            ? "Đã lưu thay đổi dự án lên trang chủ!"
            : "Đã thêm dự án mới lên trang chủ!"
        );
        setActiveTab("projects");
        setEditingId(null);
      } else {
        showToast(data.error || "Không thể lưu dự án.");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu dự án.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
        showToast(`Đã xóa dự án "${project.title}"`);
      }
    } catch {
      showToast("Không thể xóa dự án.");
    }
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 liquid-glass-strong rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-apple-text dark:text-white border border-emerald-500/40 shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Apple Settings Header Bar */}
      <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Xác thực IP Admin hợp lệ: {SITE_CONFIG.allowedAdminIp}</span>
            <span className="opacity-60">({detectedIp})</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-apple-text dark:text-white">
            Trung Tâm Quản Trị Dự Án (Apple Settings)
          </h1>
          <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400">
            Quản lý toàn bộ dự án Portfolio, tải lên Video/Hình ảnh mới, sửa chú thích hoặc xem danh sách lịch hẹn của khách hàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dự Án Mới</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full liquid-glass text-xs sm:text-sm font-semibold text-apple-text dark:text-white hover:border-apple-blue/40 transition-all"
          >
            <span>Xem Trang Chủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* macOS / iPadOS Settings Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation (Apple Settings Style) */}
        <aside className="lg:col-span-3 liquid-glass-strong rounded-3xl p-4 space-y-2">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-400">
            Bảng điều khiển macOS 26
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`w-full px-4 py-3 rounded-2xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === "projects"
                ? "bg-apple-blue text-white shadow-sm"
                : "hover:bg-black/5 dark:hover:bg-white/10 text-apple-text dark:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Danh sách dự án</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "projects"
                  ? "bg-white/20 text-white"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={handleStartCreate}
            className={`w-full px-4 py-3 rounded-2xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === "editor"
                ? "bg-apple-blue text-white shadow-sm"
                : "hover:bg-black/5 dark:hover:bg-white/10 text-apple-text dark:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-2.5">
              <Plus className="w-4 h-4" />
              <span>{editingId ? "Chỉnh sửa dự án" : "Thêm dự án mới"}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`w-full px-4 py-3 rounded-2xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === "bookings"
                ? "bg-apple-blue text-white shadow-sm"
                : "hover:bg-black/5 dark:hover:bg-white/10 text-apple-text dark:text-white"
            }`}
          >
            <span className="inline-flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Lịch hẹn khách hàng</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "bookings"
                  ? "bg-white/20 text-white"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          {/* Security Info Box inside Sidebar */}
          <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 px-3 py-2 space-y-1.5 text-xs text-apple-gray dark:text-zinc-400">
            <div className="font-bold text-apple-text dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
              <span>Bảo mật Middleware IP</span>
            </div>
            <p className="leading-relaxed">
              Chỉ duy nhất địa chỉ IP <strong>{SITE_CONFIG.allowedAdminIp}</strong> được phép truy cập trang này. Mọi IP khác đều tự động nhận trang 404.
            </p>
          </div>
        </aside>

        {/* Main Settings Content Panel */}
        <div className="lg:col-span-9">
          {activeTab === "projects" && (
            <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-apple-text dark:text-white">
                    Dự Án Đã Đăng ({projects.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400">
                    Bấm vào bất kỳ dự án nào để chỉnh sửa tên khách hàng, năm hoàn thiện, chú thích hoặc thay đổi Video/Hình ảnh.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-apple-blue/40 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto sm:flex-1">
                      <img
                        src={proj.thumbnailUrl}
                        alt={proj.title}
                        className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl object-cover shrink-0 bg-zinc-900 border border-white/15"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-apple-blue/10 text-apple-blue dark:text-sky-400">
                            {proj.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/5 dark:bg-white/10">
                            {proj.aspectRatio}
                          </span>
                          <span className="text-xs text-apple-gray dark:text-zinc-400">
                            {proj.client} • {proj.year}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-apple-text dark:text-white truncate">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-apple-gray dark:text-zinc-400 line-clamp-1">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(proj)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-apple-blue/10 hover:bg-apple-blue hover:text-white text-apple-blue dark:text-sky-400 text-xs font-bold transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "editor" && (
            <form
              onSubmit={handleSaveProject}
              className="liquid-glass-strong rounded-3xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-apple-text dark:text-white">
                    {editingId ? "Chỉnh Sửa Dự Án" : "Thêm Dự Án Mới"}
                  </h2>
                  <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400">
                    Mọi thay đổi sau khi bấm Lưu sẽ được cập nhật trực tiếp lên Trang chủ Portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Tên dự án *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="VD: Luminous Velocity — Commercial Film"
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>

                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Tên khách hàng *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="VD: Porsche Vietnam"
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>

                {/* Completion Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Năm hoàn thiện *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="VD: 2026"
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Thể loại dự án
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="VD: TVC Thương Mại, Music Video, Social / Reels..."
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Tỉ lệ khung hình
                  </label>
                  <select
                    value={form.aspectRatio}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        aspectRatio: e.target.value === "9:16" ? "9:16" : "16:9",
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white bg-white/80 dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  >
                    <option value="16:9" className="bg-white dark:bg-zinc-900">
                      16:9 (Widescreen TVC / MV)
                    </option>
                    <option value="9:16" className="bg-white dark:bg-zinc-900">
                      9:16 (Vertical Reels / TikTok / Shorts)
                    </option>
                  </select>
                </div>

                {/* Deliverables */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Hạng mục bàn giao (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={form.deliverablesText}
                    onChange={(e) =>
                      setForm({ ...form, deliverablesText: e.target.value })
                    }
                    placeholder="4K Master, Color Grading, VFX..."
                    className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                </div>
              </div>

              {/* Software Used Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                  Phần mềm hậu kỳ sử dụng
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {SOFTWARE_LIST.map((sw) => {
                    const active = form.softwareUsed.includes(sw.code);
                    return (
                      <button
                        key={sw.code}
                        type="button"
                        onClick={() => handleToggleSoftware(sw.code)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                          active
                            ? "bg-apple-blue/15 border-apple-blue text-apple-blue dark:text-sky-300"
                            : "liquid-glass border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <SoftwareSvgIcon code={sw.code} className="w-5 h-5" />
                        <span>{sw.name.replace("Adobe ", "")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                  Chú thích / Mô tả chi tiết dự án *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả vai trò, workflow dựng phim, color grading và điểm nhấn sáng tạo của dự án..."
                  className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
                />
              </div>

              {/* Video URL + Drag & Drop Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Link Video (MP4) hoặc Kéo thả file Video</span>
                  </label>
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-xs sm:text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file, "videoUrl");
                    }}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-apple-blue/35 hover:border-apple-blue p-4 flex flex-col items-center justify-center text-center gap-1.5 bg-apple-blue/5 transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-apple-blue" />
                    <span className="text-xs font-semibold text-apple-text dark:text-white">
                      {uploadingField === "videoUrl"
                        ? "Đang tải video lên..."
                        : "Kéo thả file Video vào đây hoặc bấm để chọn"}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "videoUrl");
                      }}
                    />
                  </label>
                </div>

                {/* Thumbnail URL + Drag & Drop Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Ảnh Thumbnail Bìa hoặc Kéo thả file Ảnh</span>
                  </label>
                  <input
                    type="text"
                    value={form.thumbnailUrl}
                    onChange={(e) =>
                      setForm({ ...form, thumbnailUrl: e.target.value })
                    }
                    placeholder="https://.../thumbnail.jpg"
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-xs sm:text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue"
                  />
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file, "thumbnailUrl");
                    }}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-500/35 hover:border-purple-500 p-4 flex flex-col items-center justify-center text-center gap-1.5 bg-purple-500/5 transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-purple-500" />
                    <span className="text-xs font-semibold text-apple-text dark:text-white">
                      {uploadingField === "thumbnailUrl"
                        ? "Đang tải ảnh lên..."
                        : "Kéo thả file Ảnh bìa vào đây hoặc bấm để chọn"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "thumbnailUrl");
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Stills Gallery URLs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-zinc-300">
                    Bộ sưu tập hình ảnh Stills / Hậu trường (Mỗi dòng 1 link ảnh)
                  </label>
                  <label className="cursor-pointer text-xs font-bold text-apple-blue hover:underline inline-flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>+ Tải thêm ảnh vào Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "gallery");
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={form.galleryText}
                  onChange={(e) => setForm({ ...form, galleryText: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl liquid-glass text-xs sm:text-sm text-apple-text dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className="px-5 py-2.5 rounded-full liquid-glass text-xs sm:text-sm font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs sm:text-sm font-bold shadow-lg transition-all disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? "Đang lưu..."
                      : editingId
                      ? "Lưu Thay Đổi Lên Trang Chủ"
                      : "Đăng Dự Án Mới"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "bookings" && (
            <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-apple-text dark:text-white">
                  Lịch Hẹn Khách Hàng Đặt ({bookings.length})
                </h2>
                <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400">
                  Danh sách các yêu cầu đặt lịch quay dựng & hậu kỳ từ trang Booking.
                </p>
              </div>

              <div className="space-y-3">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="liquid-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {bk.date} • {bk.timeSlot}
                        </span>
                        <span className="text-xs font-semibold text-apple-blue dark:text-sky-400">
                          {bk.projectType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-apple-text dark:text-white">
                        {bk.clientName}
                      </h3>
                      <p className="text-xs text-apple-gray dark:text-zinc-300">
                        Liên hệ: <strong>{bk.contact}</strong>
                      </p>
                      {bk.notes && (
                        <p className="text-xs text-apple-gray dark:text-zinc-400 italic">
                          &ldquo;{bk.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
