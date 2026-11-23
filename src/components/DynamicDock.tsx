"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Calendar, ShieldCheck, Sun, Moon, Sparkles } from "lucide-react";
import { useAppTheme } from "@/components/ThemeProvider";
import { SITE_CONFIG } from "@/lib/config";

export function DynamicDock() {
  const pathname = usePathname();
  const { theme, toggleTheme, isAdminIp } = useAppTheme();

  const navItems = [
    {
      href: "/",
      label: "Portfolio",
      mobileLabel: "Portfolio",
      icon: Film,
      active: pathname === "/",
    },
    {
      href: "/booking",
      label: "Đặt lịch (Booking)",
      mobileLabel: "Đặt lịch",
      icon: Calendar,
      active: pathname.startsWith("/booking"),
    },
  ];

  if (isAdminIp || pathname.startsWith("/admin")) {
    navItems.push({
      href: "/admin",
      label: "Quản lý dự án",
      mobileLabel: "Quản lý",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin"),
    });
  }

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        aria-label="Thanh điều hướng Dynamic Island"
        className="pointer-events-auto liquid-glass-strong rounded-full px-2 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-1 sm:gap-2.5 max-w-[calc(100vw-16px)]"
      >
        {/* Brand Identity Pill */}
        <Link
          href="/"
          className="flex items-center gap-1.5 pl-1.5 pr-1.5 sm:pl-2 sm:pr-2.5 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
        >
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-apple-blue/20 to-sky-400/30 ring-1 ring-white/50 shadow-sm">
            <img
              src="/portrait-giahuy.png"
              alt={SITE_CONFIG.name}
              className="w-full h-full object-cover object-top"
            />
          </span>
          <span className="hidden md:inline-block font-semibold text-sm tracking-tight text-apple-text dark:text-apple-darkText">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0" />

        {/* Navigation Links */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  item.active
                    ? "text-white"
                    : "text-apple-text/75 dark:text-apple-darkText/75 hover:text-apple-text dark:hover:text-white"
                }`}
              >
                {item.active && (
                  <motion.div
                    layoutId="dynamic-island-pill"
                    className="absolute inset-0 rounded-full bg-apple-text dark:bg-apple-blue shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 shrink-0" />
                <span className="relative z-10 sm:hidden">{item.mobileLabel}</span>
                <span className="relative z-10 hidden sm:inline">{item.label}</span>
                {item.href === "/admin" && (
                  <span
                    title="Đã xác thực IP Admin: 14.179.237.172"
                    className="relative z-10 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/15 shrink-0" />

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Chuyển đổi giao diện Sáng / Tối"
          className="p-1.5 sm:p-2 rounded-full text-apple-text/80 dark:text-apple-darkText/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
          title={theme === "light" ? "Bật chế độ Tối (Dark Mode)" : "Bật chế độ Sáng (Light Mode)"}
        >
          {theme === "light" ? (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          )}
        </button>

        {/* Quick Status Badge on Desktop */}
        <Link
          href="/booking"
          className="hidden lg:flex items-center gap-1.5 pl-2.5 pr-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-medium shrink-0 hover:bg-emerald-500/20 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Sẵn sàng nhận lịch</span>
        </Link>
      </motion.nav>
    </header>
  );
}
