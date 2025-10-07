"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ProductionNavbar } from "@/app/components/ui/production-navbar";
import Link from "next/link";

export default function EditModePage() {
  const params = useParams();
  const productionId = params.id as string;

  const handleAddFile = () => {
    // TODO: Implement add file functionality
    console.log("Add file clicked for production:", productionId);
  };

  return (
    <div className="min-h-screen bg-[var(--white)]">
      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link href={`/productions/${productionId}`}>
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
          <h1 className="text-4xl font-bold text-[var(--black)] mb-2">
            Edit Mode
          </h1>
          <p className="text-gray-600 text-lg">
            This page is under construction
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Edit mode functionality is currently being developed. 
            You&apos;ll be able to manage production details, settings, and more.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
