"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductionNavbar } from "@/components/ui/production-navbar";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function BroadcastModePage() {
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
          <div className="inline-block px-4 py-2 bg-[var(--red)] rounded-lg mb-4">
            <span className="text-[#f5f5f5] font-semibold text-sm">BROADCAST MODE</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--black)] mb-2">
            Coming soon!
          </h1>
          <p className="text-gray-600 text-lg mt-50">
            Hopefully
          </p>
        </div>
        </div>
      </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
