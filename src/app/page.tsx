import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getProjects } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const projects = getProjects();

  return (
    <div className="relative">
      <HeroSection />
      <PortfolioGrid initialProjects={projects} />
    </div>
  );
}
