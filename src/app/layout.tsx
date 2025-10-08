"use client";

import React from "react";
import Script from "next/script";
import "./globals.css";
import "./themes.css";
import { ThemeProvider } from "@/components/theme-provider";
import { KindeAuthProvider } from "@/components/KindeAuthContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
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
        
        {/* Kinde SDK */}
        <Script 
          src="https://kinde.com/sdk/v2/js/kinde-auth.umd.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}