"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Calendar,
  Film,
  Images,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Play,
} from "lucide-react";
import { Project } from "@/types/portfolio";
import { SOFTWARE_LIST, SoftwareSvgIcon } from "@/components/SoftwareIcons";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const FRAME_PERCENTAGES: Record<string, number> = {
  "1": 0.12,
  "2": 0.27,
  "3": 0.42,
  "4": 0.57,
  "5": 0.72,
  "6": 0.86,
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (project) {
      setActiveImage(project.gallery?.[0] || project.thumbnailUrl);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleJumpToHighlight = (imgUrl: string) => {
    setActiveImage(imgUrl);
    const match = imgUrl.match(/frame-(\d)\.jpg$/);
    if (match && videoRef.current && videoRef.current.duration) {
      const pct = FRAME_PERCENTAGES[match[1]] || 0.25;
      videoRef.current.currentTime = videoRef.current.duration * pct;
      videoRef.current.play().catch(() => {});
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xl"
          />

          {/* Apple OS 26 Liquid Glass Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-5xl liquid-glass-strong rounded-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-black/5 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-apple-blue/15 text-apple-blue dark:text-sky-400">
                  {project.category}
                </span>
                <span className="text-xs font-medium text-apple-gray dark:text-zinc-400 truncate">
                  {project.client} • {project.year}
                </span>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Đóng cửa sổ chi tiết dự án"
                className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-apple-text dark:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-8">
              {/* Primary Video Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-apple-blue" />
                    Trình chiếu Video Master ({project.aspectRatio})
                  </span>
                  <span>HD / 4K Playback</span>
                </div>

                <div
                  className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 mx-auto ${
                    project.aspectRatio === "9:16"
                      ? "max-w-sm aspect-[9/16] max-h-[540px]"
                      : "aspect-video"
                  }`}
                >
                  <video
                    ref={videoRef}
                    key={project.videoUrl}
                    src={project.videoUrl}
                    poster={project.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>

              {/* Project Metadata & Description Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <h2
                    id="modal-project-title"
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-apple-text dark:text-white"
                  >
                    {project.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue dark:text-sky-400">
                      <Building2 className="w-4 h-4" />
                      <span>Khách hàng: {project.client}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-apple-text dark:text-zinc-200">
                      <Calendar className="w-4 h-4" />
                      <span>Năm hoàn thiện: {project.year}</span>
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-apple-gray dark:text-zinc-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Right Specs Box */}
                <div className="lg:col-span-5 liquid-glass rounded-2xl p-5 space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-400 mb-2.5">
                      Hạng mục bàn giao (Deliverables)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(project.deliverables || ["4K Master", "Color Grading"]).map(
                        (item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{item}</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10">
                    <div className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-400 mb-2.5">
                      Phần mềm hậu kỳ sử dụng
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(project.softwareUsed || ["Pr", "Ae", "Dv"]).map((code) => {
                        const meta = SOFTWARE_LIST.find((s) => s.code === code);
                        return (
                          <div
                            key={code}
                            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                          >
                            <SoftwareSvgIcon code={code} className="w-5 h-5" />
                            <span>{meta ? meta.name.replace("Adobe ", "") : code}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10">
                    <Link
                      href="/booking"
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-apple-blue hover:bg-apple-blueHover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Đặt lịch sản xuất dự án tương tự</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Extracted Highlight Moments & Stills Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-apple-text dark:text-white">
                      <Images className="w-4 h-4 text-apple-blue" />
                      <span>
                        Cắt Cảnh Highlight Đặc Sắc Từ Video ({project.gallery.length} Khoảnh Khắc)
                      </span>
                    </span>
                    <span className="text-xs text-apple-gray dark:text-zinc-400">
                      Bấm vào từng ảnh để xem chi tiết hoặc tua nhanh Video đến đúng phân cảnh Highlight
                    </span>
                  </div>

                  {/* Active Large Highlight Preview */}
                  {activeImage && (
                    <div
                      className={`relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-black/10 dark:border-white/15 mx-auto ${
                        project.aspectRatio === "9:16"
                          ? "max-w-sm aspect-[9/16] max-h-[440px]"
                          : "aspect-video max-h-[420px]"
                      }`}
                    >
                      <img
                        src={activeImage}
                        alt="Highlight Still Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Highlight Thumbnails Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {project.gallery.map((imgUrl, idx) => (
                      <div
                        key={`${imgUrl}-${idx}`}
                        onClick={() => handleJumpToHighlight(imgUrl)}
                        className={`group cursor-pointer relative rounded-xl overflow-hidden border-2 transition-all bg-zinc-900 ${
                          project.aspectRatio === "9:16"
                            ? "aspect-[9/14]"
                            : "aspect-video"
                        } ${
                          activeImage === imgUrl
                            ? "border-apple-blue scale-[1.02] shadow-md"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Highlight ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-2">
                          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
                            Highlight #{idx + 1}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-apple-blue text-white flex items-center justify-center shadow-sm">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
