import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorizedAdminIp } from "@/lib/config";
import { getProjects, getBookings, getClientLinks } from "@/lib/storage";
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
  const clientLinks = getClientLinks();

  return (
    <AdminDashboard
      initialProjects={projects}
      initialBookings={bookings}
      initialClientLinks={clientLinks}
      detectedIp={detectedIp}
    />
  );
}
