"use client";

import React from "react";
import "./globals.css";
import "./themes.css";
import { ThemeProvider } from "@/components/theme-provider";
import KindeAuthProvider from "@/components/auth/KindeAuthProvider";
import "@/lib/kinde-config";

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[var(--dark-dark-green)]">
        <KindeAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              {children}
            </main>
          </ThemeProvider>
        </KindeAuthProvider>
      </body>
    </html>
  );
}