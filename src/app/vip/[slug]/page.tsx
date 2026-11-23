import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, Calendar, Phone, ArrowRight, CheckCircle2, Film } from "lucide-react";
import { getClientLinks, getProjects } from "@/lib/storage";
import { SITE_CONFIG } from "@/lib/config";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const dynamic = "force-dynamic";

export default function ClientCustomPitchPage({
  params,
}: {
  params: { slug: string };
}) {
  const links = getClientLinks();
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase();
  const shareLink = links.find((l) => l.slug.toLowerCase() === decodedSlug);

  if (!shareLink) {
    notFound();
  }

  const allProjects = getProjects();
  const selectedProjects =
    shareLink.projectIds && shareLink.projectIds.length > 0
      ? allProjects.filter((p) => shareLink.projectIds.includes(p.id))
      : allProjects;

  return (
    <div className="pt-28 pb-12">
      {/* Personalized VIP Client Hero Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="liquid-glass-strong rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-apple-blue/20 via-purple-500/15 to-sky-400/20 blur-3xl"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Portrait Badge */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-end justify-center">
                <div className="absolute inset-x-2 bottom-2 top-6 rounded-3xl bg-gradient-to-b from-white/50 via-sky-200/35 to-indigo-500/20 dark:from-white/10 dark:via-sky-500/15 dark:to-indigo-600/25 border border-white/60 dark:border-white/15 shadow-portrait-3d -z-10" />
                <img
                  src="/portrait-giahuy.png"
                  alt={SITE_CONFIG.name}
                  className="w-full h-full object-contain object-bottom portrait-drop-shadow"
                />
              </div>
              <div className="mt-3">
                <div className="text-lg font-extrabold text-apple-text dark:text-white">
                  {SITE_CONFIG.name}
                </div>
                <div className="text-xs font-semibold text-apple-blue dark:text-sky-400">
                  {SITE_CONFIG.role}
                </div>
              </div>
            </div>

            {/* Right Personalized Message for the Client */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue dark:text-sky-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hồ Sơ Showreel Độc Quyền Dành Riêng Cho: {shareLink.clientName}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-apple-text dark:text-white leading-tight">
                {shareLink.customTitle}
              </h1>

              <p className="text-sm sm:text-base text-apple-gray dark:text-zinc-300 leading-relaxed">
                {shareLink.welcomeMessage}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedProjects.length} Dự án được tuyển chọn riêng</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-apple-text dark:text-zinc-200">
                  <Film className="w-3.5 h-3.5 text-apple-blue" />
                  <span>Trình chiếu 4K + Cắt cảnh Highlight</span>
                </span>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Họp Brief Cùng Gia Huy</span>
                </Link>

                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full liquid-glass text-xs sm:text-sm font-bold text-apple-text dark:text-white hover:border-emerald-500/40 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Gọi / Zalo: {SITE_CONFIG.phoneDisplay}</span>
                </a>

                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-apple-gray hover:text-apple-blue transition-colors px-2 py-1"
                >
                  <span>Xem toàn bộ Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Portfolio Grid for this Client */}
      <PortfolioGrid
        initialProjects={selectedProjects}
        disableAutoSync={true}
      />
    </div>
  );
}
