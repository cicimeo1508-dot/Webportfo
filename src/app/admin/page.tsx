import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorizedAdminIp } from "@/lib/config";
import { getProjects, getBookings } from "@/lib/storage";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const reqHeaders = headers();
  const { allowed, detectedIp } = isAuthorizedAdminIp(reqHeaders);

  if (!allowed) {
    notFound();
  }

  const projects = getProjects();
  const bookings = getBookings();

  return (
    <AdminDashboard
      initialProjects={projects}
      initialBookings={bookings}
      detectedIp={detectedIp}
    />
  );
}
