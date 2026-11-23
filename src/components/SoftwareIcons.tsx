import React from "react";
import { SoftwareCode } from "@/types/portfolio";

export interface SoftwareMeta {
  code: SoftwareCode;
  name: string;
  role: string;
  accent: string;
  glow: string;
}

export const SOFTWARE_LIST: SoftwareMeta[] = [
  {
    code: "Pr",
    name: "Adobe Premiere Pro",
    role: "Offline & Online Editing",
    accent: "#9999FF",
    glow: "rgba(153, 153, 255, 0.45)",
  },
  {
    code: "Ae",
    name: "Adobe After Effects",
    role: "VFX & Motion Graphics",
    accent: "#D291FF",
    glow: "rgba(210, 145, 255, 0.45)",
  },
  {
    code: "Dv",
    name: "DaVinci Resolve",
    role: "ACES Color Grading",
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.45)",
  },
  {
    code: "Ps",
    name: "Adobe Photoshop",
    role: "Key Art & Matte Paint",
    accent: "#31A8FF",
    glow: "rgba(49, 168, 255, 0.45)",
  },
  {
    code: "Lr",
    name: "Adobe Lightroom",
    role: "RAW Stills & Look Dev",
    accent: "#38E8FF",
    glow: "rgba(56, 232, 255, 0.45)",
  },
];

export function SoftwareSvgIcon({
  code,
  className = "w-8 h-8",
}: {
  code: SoftwareCode;
  className?: string;
}) {
  switch (code) {
    case "Pr":
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Adobe Premiere Pro">
          <rect width="64" height="64" rx="15" fill="url(#pr_bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="13.5"
            stroke="#9999FF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <path
            d="M15.5 45V18.8H25.2C30.8 18.8 34.4 22.1 34.4 27.3C34.4 32.6 30.7 35.9 25.0 35.9H20.7V45H15.5ZM20.7 31.6H24.7C27.7 31.6 29.3 29.9 29.3 27.3C29.3 24.7 27.7 23.1 24.7 23.1H20.7V31.6Z"
            fill="#E5E5FF"
          />
          <path
            d="M38.2 45V25.4H42.9V28.7C44.0 26.3 46.1 25.0 48.7 25.0C49.4 25.0 50.0 25.1 50.5 25.2V29.9C49.9 29.7 49.0 29.6 48.1 29.6C45.2 29.6 43.3 31.4 43.3 34.6V45H38.2Z"
            fill="#9999FF"
          />
          <defs>
            <linearGradient id="pr_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2A0845" />
              <stop offset="1" stopColor="#0F051D" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "Ae":
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Adobe After Effects">
          <rect width="64" height="64" rx="15" fill="url(#ae_bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="13.5"
            stroke="#D291FF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <path
            d="M12.2 45L21.5 18.8H27.3L36.5 45H31.1L29.1 38.9H19.5L17.5 45H12.2ZM20.8 34.6H27.8L24.4 24.1H24.2L20.8 34.6Z"
            fill="#F3E5FF"
          />
          <path
            d="M46.6 45.4C40.7 45.4 37.0 41.5 37.0 35.3C37.0 29.1 40.7 25.0 46.4 25.0C51.9 25.0 55.4 28.8 55.4 34.8V36.5H41.9C42.1 39.6 43.9 41.5 46.8 41.5C48.9 41.5 50.4 40.5 51.1 39.0L55.1 40.8C53.8 43.7 50.8 45.4 46.6 45.4ZM42.0 33.2H50.6C50.4 30.5 48.8 28.8 46.4 28.8C44.0 28.8 42.3 30.5 42.0 33.2Z"
            fill="#D291FF"
          />
          <defs>
            <linearGradient id="ae_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#310A5B" />
              <stop offset="1" stopColor="#120424" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "Ps":
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Adobe Photoshop">
          <rect width="64" height="64" rx="15" fill="url(#ps_bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="13.5"
            stroke="#31A8FF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <path
            d="M15.0 45V18.8H24.7C30.3 18.8 33.9 22.1 33.9 27.3C33.9 32.6 30.2 35.9 24.5 35.9H20.2V45H15.0ZM20.2 31.6H24.2C27.2 31.6 28.8 29.9 28.8 27.3C28.8 24.7 27.2 23.1 24.2 23.1H20.2V31.6Z"
            fill="#E0F2FE"
          />
          <path
            d="M44.5 45.4C39.6 45.4 36.5 43.1 36.1 39.4H40.8C41.1 41.0 42.4 41.9 44.6 41.9C46.7 41.9 48.0 41.0 48.0 39.6C48.0 38.4 47.1 37.7 44.8 37.2L41.8 36.5C38.2 35.7 36.5 33.8 36.5 30.8C36.5 27.2 39.6 25.0 44.3 25.0C48.8 25.0 51.8 27.2 52.1 30.7H47.6C47.3 29.3 46.1 28.4 44.2 28.4C42.3 28.4 41.1 29.3 41.1 30.5C41.1 31.7 42.0 32.3 44.2 32.8L47.2 33.5C51.1 34.4 52.8 36.2 52.8 39.3C52.8 43.1 49.5 45.4 44.5 45.4Z"
            fill="#31A8FF"
          />
          <defs>
            <linearGradient id="ps_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#05264C" />
              <stop offset="1" stopColor="#021024" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "Lr":
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Adobe Lightroom">
          <rect width="64" height="64" rx="15" fill="url(#lr_bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="13.5"
            stroke="#38E8FF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <path d="M16.0 45V18.8H21.3V40.5H33.5V45H16.0Z" fill="#E0FBFF" />
          <path
            d="M37.5 45V25.4H42.2V28.7C43.3 26.3 45.4 25.0 48.0 25.0C48.7 25.0 49.3 25.1 49.8 25.2V29.9C49.2 29.7 48.3 29.6 47.4 29.6C44.5 29.6 42.6 31.4 42.6 34.6V45H37.5Z"
            fill="#38E8FF"
          />
          <defs>
            <linearGradient id="lr_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#073247" />
              <stop offset="1" stopColor="#031520" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "Dv":
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="DaVinci Resolve">
          <rect width="64" height="64" rx="15" fill="url(#dv_bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="13.5"
            stroke="#38BDF8"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          {/* DaVinci Resolve 3 Color Wheels Emblem */}
          <circle cx="32" cy="20.5" r="8.5" fill="url(#dv_top)" />
          <circle cx="22.5" cy="38.5" r="8.5" fill="url(#dv_left)" />
          <circle cx="41.5" cy="38.5" r="8.5" fill="url(#dv_right)" />
          <circle cx="32" cy="32.5" r="4.2" fill="#0B1324" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.2" />
          <defs>
            <linearGradient id="dv_bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#111C35" />
              <stop offset="1" stopColor="#060A14" />
            </linearGradient>
            <linearGradient id="dv_top" x1="23.5" y1="12" x2="40.5" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="dv_left" x1="14" y1="30" x2="31" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="#0D9488" />
            </linearGradient>
            <linearGradient id="dv_right" x1="33" y1="30" x2="50" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB7185" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
