"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Copy, Check, ArrowUpRight, Film, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  };

  return (
    <footer className="relative mt-20 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-950/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="liquid-glass rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Identity */}
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue dark:text-sky-400 text-xs font-semibold tracking-wide uppercase">
                <span>Apple OS 26 Spatial Portfolio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-apple-text dark:text-white">
                {SITE_CONFIG.name}
              </h2>
              <p className="text-sm sm:text-base text-apple-gray dark:text-zinc-400 max-w-md leading-relaxed">
                {SITE_CONFIG.role} — {SITE_CONFIG.subtitle}
              </p>
            </div>

            {/* Right Contact Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 group hover:border-apple-blue/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-400">
                    <Mail className="w-4 h-4 text-apple-blue" />
                    Email Liên Hệ
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-apple-blue hover:text-white transition-colors"
                    title="Sao chép địa chỉ Email"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm sm:text-base font-semibold text-apple-text dark:text-white hover:text-apple-blue dark:hover:text-sky-400 transition-colors break-all flex items-center gap-1"
                >
                  <span>{SITE_CONFIG.email}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Phone Card */}
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 group hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-400">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    Hotline / Zalo Trực Tiếp
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Gọi ngay
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold tracking-tight text-apple-text dark:text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                  <span>{SITE_CONFIG.phoneDisplay}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-apple-gray dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} {SITE_CONFIG.name}.</span>
              <span>Thiết kế theo ngôn ngữ Apple visionOS 26 Liquid Glass.</span>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-apple-text dark:hover:text-white transition-colors"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 hover:text-apple-text dark:hover:text-white transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Đặt lịch quay & dựng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
