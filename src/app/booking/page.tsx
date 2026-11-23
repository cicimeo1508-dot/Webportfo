"use client";

import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Film,
  FileText,
  Send,
  PhoneCall,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { Booking } from "@/types/portfolio";

const TIME_SLOTS = [
  { id: "09:00 - 11:00", label: "09:00 - 11:00", tag: "Buổi sáng • Review & Brief" },
  { id: "14:00 - 16:00", label: "14:00 - 16:00", tag: "Buổi chiều • Dựng & Color" },
  { id: "16:30 - 18:30", label: "16:30 - 18:30", tag: "Cuối chiều • On-set / Họp" },
  { id: "20:00 - 21:30", label: "20:00 - 21:30", tag: "Buổi tối • Online Session" },
];

const PROJECT_TYPES = [
  "TVC Thương Mại / Quảng Cáo",
  "Music Video (MV)",
  "Social Video / Reels / TikTok (9:16)",
  "Color Grading (DaVinci Resolve ACES)",
  "D.O.P Quay Phim & Hậu Kỳ Trọn Gói",
  "Phim Tài Liệu / Phim Doanh Nghiệp",
];

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1].id);
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.bookings) setRecentBookings(data.bookings);
      })
      .catch(() => {});
  }, []);

  const formattedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const displayDateVi = selectedDate
    ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })
    : "Chưa chọn ngày";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!clientName.trim() || !contact.trim()) {
      setErrorMessage("Vui lòng nhập Tên của bạn và Email hoặc Số điện thoại liên hệ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          contact,
          projectType,
          date: formattedDate,
          timeSlot: selectedSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Có lỗi xảy ra khi đặt lịch.");
      } else {
        setSubmittedBooking(data.booking);
        if (data.bookings) setRecentBookings(data.bookings);
        setClientName("");
        setContact("");
        setNotes("");
      }
    } catch {
      setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs font-semibold text-apple-blue dark:text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apple OS 26 Smart Scheduling • Đặt lịch trực tuyến</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-apple-text dark:text-white">
          Đặt Lịch Họp Brief & Sản Xuất
        </h1>
        <p className="text-sm sm:text-base text-apple-gray dark:text-zinc-400 leading-relaxed">
          Chọn ngày và khung giờ phù hợp trên lịch kính mờ bên dưới để lên lịch trao đổi trực tiếp cùng{" "}
          <strong className="text-apple-text dark:text-white">{SITE_CONFIG.name}</strong> cho dự án tiếp theo của bạn.
        </p>
      </div>

      {/* Main 2-Column Apple Glass Booking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Custom Apple OS 26 Liquid Glass Calendar & Time Slots */}
        <div className="lg:col-span-6 space-y-6">
          <div className="liquid-glass-strong rounded-3xl p-5 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-apple-blue/10 text-apple-blue">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-apple-text dark:text-white">
                    1. Chọn Ngày Làm Việc
                  </h2>
                  <p className="text-xs text-apple-gray dark:text-zinc-400 capitalize">
                    {displayDateVi}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Còn lịch trống
              </span>
            </div>

            {/* Custom Styled React Day Picker */}
            <div className="flex justify-center overflow-x-auto py-1">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                locale={vi}
                showOutsideDays
                className="p-1 sm:p-2"
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-3",
                  month_caption:
                    "flex justify-center items-center h-10 font-bold text-sm sm:text-base capitalize text-apple-text dark:text-white",
                  nav: "flex items-center justify-between",
                  button_previous:
                    "w-8 h-8 rounded-full liquid-glass flex items-center justify-center hover:bg-apple-blue hover:text-white transition-colors",
                  button_next:
                    "w-8 h-8 rounded-full liquid-glass flex items-center justify-center hover:bg-apple-blue hover:text-white transition-colors",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid grid-cols-7 gap-1 mb-1",
                  weekday:
                    "text-center text-[11px] font-semibold uppercase text-apple-gray dark:text-zinc-400 py-1",
                  week: "grid grid-cols-7 gap-1 mt-1",
                  day: "text-center p-0",
                  day_button:
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center mx-auto transition-all hover:bg-apple-blue/15 dark:hover:bg-white/15",
                  selected:
                    "!bg-apple-blue !text-white shadow-md rounded-full font-bold",
                  today:
                    "ring-1 ring-apple-blue text-apple-blue dark:text-sky-400 rounded-full font-bold",
                  outside: "opacity-30",
                  disabled: "opacity-25 cursor-not-allowed",
                }}
              />
            </div>

            {/* Time Slots Selection */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-apple-text dark:text-white">
                <Clock className="w-4 h-4 text-apple-blue" />
                <span>2. Chọn Khung Giờ Trống ({formattedDate})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedSlot === slot.id;
                  const isBooked = recentBookings.some(
                    (b) => b.date === formattedDate && b.timeSlot === slot.id
                  );

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1 ${
                        active
                          ? "bg-apple-blue text-white border-apple-blue shadow-lg scale-[1.01]"
                          : "liquid-glass hover:border-apple-blue/40 text-apple-text dark:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{slot.label}</span>
                        {isBooked ? (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                            }`}
                          >
                            Ưu tiên
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            Trống
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          active ? "text-white/85" : "text-apple-gray dark:text-zinc-400"
                        }`}
                      >
                        {slot.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Booking Form & Confirmation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-apple-text dark:text-white mb-1">
              3. Thông Tin Khách Hàng & Dự Án
            </h2>
            <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-400 mb-6">
              Điền thông tin bên dưới để hệ thống khóa lịch làm việc và gửi xác nhận ngay lập tức.
            </p>

            <AnimatePresence mode="wait">
              {submittedBooking ? (
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl p-6 bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-apple-text dark:text-white">
                      Đặt Lịch Thành Công!
                    </h3>
                    <p className="text-xs sm:text-sm text-apple-gray dark:text-zinc-300">
                      Cảm ơn <strong>{submittedBooking.clientName}</strong>. Lịch hẹn của bạn đã được ghi nhận vào hệ thống của{" "}
                      <strong>{SITE_CONFIG.name}</strong>.
                    </p>
                  </div>

                  <div className="liquid-glass rounded-2xl p-4 text-left text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-apple-gray">Ngày hẹn:</span>
                      <span className="font-bold">{submittedBooking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-apple-gray">Khung giờ:</span>
                      <span className="font-bold text-apple-blue dark:text-sky-400">
                        {submittedBooking.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-apple-gray">Hạng mục:</span>
                      <span className="font-semibold">{submittedBooking.projectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-apple-gray">Liên hệ:</span>
                      <span className="font-semibold">{submittedBooking.contact}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmittedBooking(null)}
                    className="px-6 py-2.5 rounded-full bg-apple-text dark:bg-apple-blue text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Đặt thêm lịch hẹn khác
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs sm:text-sm font-medium">
                      {errorMessage}
                    </div>
                  )}

                  {/* Selected Date/Time Summary Pill */}
                  <div className="p-3.5 rounded-2xl bg-apple-blue/10 border border-apple-blue/20 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-apple-text dark:text-white">
                      Lịch đã chọn: <strong className="text-apple-blue dark:text-sky-400">{formattedDate}</strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-apple-blue text-white font-bold text-xs">
                      {selectedSlot}
                    </span>
                  </div>

                  {/* Client Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-apple-blue" />
                      <span>Tên của bạn / Tên Agency *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="VD: Nguyễn Hoàng Nam (Producer)"
                      className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                    />
                  </div>

                  {/* Contact Email / Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-apple-blue" />
                      <span>Email hoặc Số điện thoại / Zalo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="VD: producer@brand.vn hoặc 0909xxxxxx"
                      className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-apple-blue" />
                      <span>Loại dự án Video</span>
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white bg-white/80 dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                    >
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt} value={pt} className="bg-white dark:bg-zinc-900">
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-apple-gray dark:text-zinc-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-apple-blue" />
                      <span>Ghi chú dự án (Thời lượng, Deadline, Link Brief...)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mô tả ngắn gọn mong muốn của bạn về phong cách dựng, màu sắc hoặc lịch bấm máy..."
                      className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-text dark:text-white placeholder:text-apple-gray/60 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting ? "Đang xác nhận lịch hẹn..." : "Xác Nhận Đặt Lịch Ngay"}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Direct Urgent Contact Strip */}
            <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-apple-gray dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cần gấp cho dự án On-set / Deadline hôm nay?</span>
              </span>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="font-bold text-apple-text dark:text-white hover:text-apple-blue transition-colors"
              >
                Gọi trực tiếp: {SITE_CONFIG.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
