export type SoftwareCode = "Pr" | "Ae" | "Ps" | "Lr" | "Dv";

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  aspectRatio: "16:9" | "9:16";
  featured?: boolean;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  gallery: string[];
  deliverables: string[];
  softwareUsed: SoftwareCode[];
  createdAt: string;
}

export interface Booking {
  id: string;
  clientName: string;
  contact: string;
  projectType: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: "confirmed" | "pending";
  createdAt: string;
}
