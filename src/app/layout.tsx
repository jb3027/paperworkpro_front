"use client";

import React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <main className="min-h-screen">
          {children}
        </main>

        </ThemeProvider>
      </body>
    </html>
  );
}