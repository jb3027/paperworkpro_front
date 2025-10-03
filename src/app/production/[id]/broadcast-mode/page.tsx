"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ProductionNavbar } from "@/app/components/ui/production-navbar";
import Link from "next/link";

export default function BroadcastModePage() {
  const params = useParams();
  const productionId = params.id as string;

  const handleAddFile = () => {
    // TODO: Implement add file functionality
    console.log("Add file clicked for production:", productionId);
  };

  return (
    <div className="min-h-screen bg-[var(--red)]">
      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} onAddFile={handleAddFile} />
      
      <div className="p-6">
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
          <div className="inline-block px-4 py-2 bg-[#f59e0b]/20 rounded-lg mb-4">
            <span className="text-[#f59e0b] font-semibold text-sm">BROADCAST MODE</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--black)] mb-2">
            Broadcast Mode
          </h1>
          <p className="text-gray-600 text-lg">
            This page is under construction
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#f59e0b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-[#f59e0b] border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-[var(--black)] mb-2">Coming Soon</h2>
            <p className="text-gray-600">
              Broadcast mode functionality will be available here
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
