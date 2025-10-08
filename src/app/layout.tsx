"use client";

import React from "react";
import "./globals.css";
import "./themes.css";
import { ThemeProvider } from "@/components/theme-provider";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

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
        <KindeProvider
          clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID || "059f84ab1651486382d0b77e79fb01d3"}
          domain={process.env.NEXT_PUBLIC_KINDE_DOMAIN || "https://gaialith.kinde.com"}
          redirectUri={process.env.NEXT_PUBLIC_KINDE_REDIRECT_URI || "http://localhost:3000"}
          postLogoutRedirectUri={process.env.NEXT_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL || "http://localhost:3000"}
        >
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
        </KindeProvider>
      </body>
    </html>
  );
}