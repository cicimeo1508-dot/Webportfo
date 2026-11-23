import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 pt-24">
      <div className="liquid-glass-strong rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-apple-blue/10 text-apple-blue flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-apple-gray">
            404 • Không tìm thấy trang
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-apple-text dark:text-white">
            Trang không tồn tại
          </h1>
          <p className="text-sm text-apple-gray dark:text-zinc-400 leading-relaxed">
            Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-text dark:bg-apple-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay về Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
