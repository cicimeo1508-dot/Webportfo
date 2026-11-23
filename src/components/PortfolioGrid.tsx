"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Images,
  Video,
  Calendar,
  Building2,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Project } from "@/types/portfolio";
import { SoftwareSvgIcon } from "@/components/SoftwareIcons";
import { ProjectModal } from "@/components/ProjectModal";

interface PortfolioGridProps {
  initialProjects: Project[];
}

function ProjectBentoCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const isVertical = project.aspectRatio === "9:16";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      className={`group cursor-pointer liquid-glass rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:border-apple-blue/40 ${
        isVertical
          ? "md:col-span-4 lg:col-span-4"
          : project.featured
          ? "md:col-span-8 lg:col-span-8"
          : "md:col-span-6 lg:col-span-6"
      }`}
    >
      {/* Media Preview Area (Supports 16:9 and 9:16 cleanly) */}
      <div
        className={`relative w-full overflow-hidden bg-zinc-900 ${
          isVertical
            ? "aspect-[9/13] sm:aspect-[9/14] max-h-[460px]"
            : "aspect-video max-h-[460px]"
        }`}
      >
        {/* High-res Thumbnail Image */}
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovering ? "scale-105 opacity-25" : "scale-100 opacity-95"
          }`}
        />

        {/* Hover Video Preview */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Subtle Dark Gradient Overlay for Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 pointer-events-none" />

        {/* Top Badges: Category + Aspect Ratio */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/55 text-white backdrop-blur-md border border-white/20">
            {project.category}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/25">
            {isVertical ? (
              <Smartphone className="w-3 h-3" />
            ) : (
              <Monitor className="w-3 h-3" />
            )}
            <span>{project.aspectRatio}</span>
          </span>
        </div>

        {/* Center Play Indicator Pill on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`w-14 h-14 rounded-full bg-white/25 backdrop-blur-xl border border-white/50 flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
              isHovering ? "scale-110 bg-apple-blue/90 border-white" : "scale-95 opacity-85"
            }`}
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom Media Indicator Bar inside Thumbnail */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs font-medium">
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span>Video 4K</span>
            <span className="opacity-40">+</span>
            <Images className="w-3.5 h-3.5 text-purple-300" />
            <span>{project.gallery?.length || 1} Hình ảnh</span>
          </div>

          {/* Software Mini Icons */}
          <div className="flex items-center -space-x-1.5">
            {(project.softwareUsed || ["Pr", "Ae"]).map((code) => (
              <div
                key={code}
                className="w-6 h-6 rounded-lg overflow-hidden ring-1 ring-white/40 shadow-sm"
              >
                <SoftwareSvgIcon code={code} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Body: Client, Year, Title & Description */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Client Name & Completion Year */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-apple-blue dark:text-sky-400">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Khách hàng: {project.client}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-apple-text dark:text-zinc-200">
              <Calendar className="w-3 h-3" />
              <span>Năm: {project.year}</span>
            </span>
          </div>

          {/* Project Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-apple-text dark:text-white group-hover:text-apple-blue dark:group-hover:text-sky-400 transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 shrink-0 text-apple-gray group-hover:text-apple-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {/* Concise Description */}
          <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Deliverables Pills */}
        {project.deliverables && project.deliverables.length > 0 && (
          <div className="pt-3 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center gap-1.5">
            {project.deliverables.map((item) => (
              <span
                key={item}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] text-apple-text/80 dark:text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function PortfolioGrid({ initialProjects }: PortfolioGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  React.useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    "Tất cả",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    selectedCategory === "Tất cả"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="portfolio-showcase"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Works • Bento Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-apple-text dark:text-white">
            Dự Án Nổi Bật
          </h2>
          <p className="text-sm sm:text-base text-apple-gray dark:text-zinc-400 max-w-xl">
            Di chuột vào từng thẻ dự án để xem nhanh video preview, hoặc bấm vào dự án để mở trình chiếu 4K chất lượng cao và bộ sưu tập hình ảnh hậu trường (Stills/BTS).
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-apple-text dark:bg-apple-blue text-white shadow-sm"
                    : "liquid-glass text-apple-text/75 dark:text-zinc-300 hover:text-apple-text dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid (12-column responsive layout on Desktop/Tablet, 1-column on Mobile) */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectBentoCard
              key={project.id}
              project={project}
              onSelect={(p) => setActiveProject(p)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Apple-Style Project Detail Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
