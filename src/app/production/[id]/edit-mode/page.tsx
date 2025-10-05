"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    </div>
  );
}
