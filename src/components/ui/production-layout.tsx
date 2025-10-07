"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface ProductionLayoutProps {
  children: React.ReactNode;
}

export function ProductionLayout({ children }: ProductionLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--white)] relative overflow-hidden">
      <SidebarProvider
        style={{ "--sidebar-width": "calc(var(--spacing) * 72)" } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none bg-[var(--white)]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
