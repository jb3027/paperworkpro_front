"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductionNavbar } from "@/components/ui/production-navbar";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function EditModePage() {
  const params = useParams();
  const productionId = params.id as string;

  const handleAddFile = () => {
    // TODO: Implement add file functionality
    console.log("Add file clicked for production:", productionId);
  };

  return (
    <div className="min-h-screen bg-[var(--white)]">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
          {/* Production Navbar */}
          <ProductionNavbar productionId={productionId} />
      
      <div className="p-6 mt-20">
        <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link href={`/production/${productionId}`}>
          <Button variant="ghost" className="text-gray-600 hover:text-[var(--black)] hover:bg-gray-100 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Production
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-4 py-2 bg-[#0d9488]/20 rounded-lg mb-4">
            <span className="text-[#10b981] font-semibold text-sm">EDIT MODE</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--black)] mb-2">Coming Soon</h2>
            <p className="text-gray-600">
              Edit mode functionality will be available here
            </p>
        </div>
        </div>

      </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
