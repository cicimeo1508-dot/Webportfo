import { NextRequest, NextResponse } from "next/server";
import { getBookings, saveBookings } from "@/lib/storage";
import { Booking } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = getBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, contact, projectType, date, timeSlot, notes } = body;

    if (!clientName || !contact || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ Tên, Thông tin liên hệ, Ngày và Khung giờ." },
        { status: 400 }
      );
    }

    const bookings = getBookings();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName: String(clientName).trim(),
      contact: String(contact).trim(),
      projectType: String(projectType || "TVC / Commercial").trim(),
      date: String(date).trim(),
      timeSlot: String(timeSlot).trim(),
      notes: String(notes || "").trim(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    console.log(
      `[LOG ĐẶT LỊCH] Khách hàng "${newBooking.clientName}" đã đặt lịch ngày ${newBooking.date} (${newBooking.timeSlot})`
    );

    return NextResponse.json({ booking: newBooking, bookings: updated }, { status: 201 });
  } catch (error) {
    console.error("[LOG LỖI API] Lỗi khi xử lý đặt lịch:", error);
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu đặt lịch. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
