"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Calendar, Sparkles, Award, Film, Aperture } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { SOFTWARE_LIST, SoftwareSvgIcon } from "@/components/SoftwareIcons";

const ORBIT_POSITIONS = [
  // Pr - Top Left
  {
    code: "Pr" as const,
    desktopClass: "top-6 -left-6 sm:top-8 sm:-left-12 md:-left-20",
    floatDelay: 0,
    rotate: -6,
  },
  // Ae - Top Right
  {
    code: "Ae" as const,
    desktopClass: "top-6 -right-6 sm:top-10 sm:-right-12 md:-right-20",
    floatDelay: 0.6,
    rotate: 6,
  },
  // Dv - Mid Left
  {
    code: "Dv" as const,
    desktopClass: "top-1/2 -translate-y-1/2 -left-8 sm:-left-16 md:-left-28",
    floatDelay: 1.1,
    rotate: -4,
  },
  // Ps - Mid Right
  {
    code: "Ps" as const,
    desktopClass: "top-1/2 -translate-y-1/2 -right-8 sm:-right-16 md:-right-28",
    floatDelay: 1.6,
    rotate: 5,
  },
  // Lr - Bottom Right / Orbit
  {
    code: "Lr" as const,
    desktopClass: "bottom-6 -right-4 sm:bottom-8 sm:-right-10 md:-right-16",
    floatDelay: 2.1,
    rotate: -5,
  },
];

export function HeroSection() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / 28;
    const moveY = (e.clientY - centerY) / 28;
    setMouseOffset({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient Apple OS 26 Spatial Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-gradient-to-tr from-sky-400/20 via-indigo-500/15 to-purple-500/20 blur-3xl -z-10"
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top visionOS Spatial Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-full px-4 py-1.5 mb-8 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-apple-text/80 dark:text-zinc-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Apple OS 26 Liquid Glass • Video Editor & D.O.P Portfolio</span>
        </motion.div>

        {/* CENTER PIECE: Cutout Portrait + Orbiting 3D Floating Glass Software Badges */}
        <div className="relative w-full max-w-[330px] sm:max-w-[440px] md:max-w-[500px] flex flex-col items-center justify-center my-2 sm:my-4">
          {/* Portrait Container with 3D Cutout Depth Effect */}
          <motion.div
            style={{
              transform: `perspective(1000px) rotateX(${-mouseOffset.y * 0.45}deg) rotateY(${mouseOffset.x * 0.45}deg)`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="relative w-60 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 flex items-end justify-center select-none"
          >
            {/* Glowing Spatial Backplate Aura (Behind Cutout Subject) */}
            <div className="absolute inset-x-4 bottom-3 top-10 rounded-[40px] bg-gradient-to-b from-white/40 via-sky-200/30 to-indigo-500/20 dark:from-white/10 dark:via-sky-500/15 dark:to-indigo-600/25 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-portrait-3d -z-10" />

            {/* Subtle Apple Spatial Grid Lines inside pedestal */}
            <div className="absolute inset-x-8 bottom-6 top-16 rounded-[32px] border border-white/40 dark:border-white/10 pointer-events-none -z-10" />

            {/* Cutout Portrait Image (Transparent Background SVG/PNG with 3D Drop Shadow) */}
            <motion.img
              src="/portrait-giahuy.svg"
              alt={`Chân dung tách phông của ${SITE_CONFIG.name} - ${SITE_CONFIG.role}`}
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="w-full h-full object-contain object-bottom portrait-drop-shadow pointer-events-none z-10"
            />

            {/* Bottom Glass Pedestal Reflection Bar */}
            <div className="absolute -bottom-3 inset-x-6 h-7 rounded-full liquid-glass-strong flex items-center justify-center gap-2 px-4 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-apple-text dark:text-white">
                4K / 8K RAW Workflow • ACES Colorist
              </span>
            </div>
          </motion.div>

          {/* 5 Floating 3D Glass Software Badges around the Portrait */}
          {ORBIT_POSITIONS.map((pos, index) => {
            const meta = SOFTWARE_LIST.find((s) => s.code === pos.code)!;
            const parallaxFactor = (index % 2 === 0 ? 1 : -1) * 0.85;

            return (
              <motion.div
                key={meta.code}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                  x: mouseOffset.x * parallaxFactor,
                }}
                transition={{
                  opacity: { duration: 0.4, delay: index * 0.1 },
                  scale: { duration: 0.4, delay: index * 0.1 },
                  y: {
                    duration: 3.6 + index * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: pos.floatDelay,
                  },
                  x: { type: "spring", stiffness: 120, damping: 18 },
                }}
                whileHover={{
                  scale: 1.14,
                  rotate: 0,
                  y: -6,
                  transition: { type: "spring", stiffness: 400, damping: 18 },
                }}
                style={{ rotate: pos.rotate }}
                className={`hidden sm:flex absolute ${pos.desktopClass} z-30 liquid-badge-3d rounded-2xl p-2.5 md:px-3.5 md:py-2.5 items-center gap-2.5 cursor-pointer group`}
              >
                <div
                  className="relative shrink-0 rounded-xl overflow-hidden shadow-md transition-transform group-hover:scale-105"
                  style={{ boxShadow: `0 6px 18px ${meta.glow}` }}
                >
                  <SoftwareSvgIcon code={meta.code} className="w-9 h-9 md:w-10 md:h-10" />
                </div>
                <div className="hidden md:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold leading-tight text-apple-text dark:text-white">
                    {meta.name.replace("Adobe ", "")}
                  </span>
                  <span className="text-[10px] font-medium text-apple-gray dark:text-zinc-400">
                    {meta.role}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Mobile Responsive 3D Floating Software Dock (Visible on <640px so no horizontal overflow occurs) */}
          <div className="flex sm:hidden flex-wrap items-center justify-center gap-2.5 mt-7 z-30">
            {SOFTWARE_LIST.map((meta, idx) => (
              <motion.div
                key={meta.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  y: {
                    duration: 2.8 + idx * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileTap={{ scale: 0.94 }}
                className="liquid-badge-3d rounded-2xl px-2.5 py-2 flex items-center gap-1.5"
              >
                <SoftwareSvgIcon code={meta.code} className="w-7 h-7" />
                <span className="text-xs font-semibold text-apple-text dark:text-white">
                  {meta.code === "Dv" ? "DaVinci" : meta.code}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NAME & ROLE TYPOGRAPHY DIRECTLY BELOW PORTRAIT */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-6 sm:mt-8 space-y-4 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-apple-text dark:text-white leading-[1.06]">
            {SITE_CONFIG.name}
          </h1>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-base sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-apple-blue via-indigo-500 to-sky-400 bg-clip-text text-transparent">
            <span>{SITE_CONFIG.role}</span>
            <span className="text-apple-gray/40">•</span>
            <span>Visual Storyteller & Colorist</span>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-apple-gray dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {SITE_CONFIG.subtitle} Chuyên dựng TVC quảng cáo, Music Video, Fashion Reels & chỉnh màu điện ảnh trên hệ sinh thái Adobe Creative Cloud & DaVinci Resolve Studio.
          </p>
        </motion.div>

        {/* CTA Buttons & Spatial Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <a
            href="#portfolio-showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-apple-text dark:bg-white text-white dark:text-black font-semibold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Xem Showreel & Dự Án</span>
          </a>

          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full liquid-glass-strong text-apple-text dark:text-white font-semibold text-sm sm:text-base hover:border-apple-blue/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calendar className="w-4 h-4 text-apple-blue" />
            <span>Đặt Lịch Dựng Phim / Quay</span>
          </Link>
        </motion.div>

        {/* Spatial Glass Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl"
        >
          <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-xl bg-apple-blue/10 text-apple-blue">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs text-apple-gray dark:text-zinc-400">Kinh nghiệm thực chiến</div>
              <div className="text-sm font-bold text-apple-text dark:text-white">{SITE_CONFIG.experienceYears}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Film className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs text-apple-gray dark:text-zinc-400">Hậu kỳ & D.O.P</div>
              <div className="text-sm font-bold text-apple-text dark:text-white">{SITE_CONFIG.completedProjects}</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Aperture className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs text-apple-gray dark:text-zinc-400">Tỉ lệ khách hàng</div>
              <div className="text-sm font-bold text-apple-text dark:text-white">{SITE_CONFIG.clientSatisfaction}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
