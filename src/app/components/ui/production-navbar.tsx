"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface ProductionNavbarProps {
  productionId: string;
  onAddFile?: () => void;
}

export function ProductionNavbar({ productionId, onAddFile }: ProductionNavbarProps) {
  return (
    <nav className="bg-[var(--dark-green)] border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[#fafaf9]">
            Production Files
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={onAddFile}
            className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-[#fafaf9] px-4 py-2 flex items-center gap-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add File
          </Button>
        </div>
      </div>
    </nav>
  );
}
