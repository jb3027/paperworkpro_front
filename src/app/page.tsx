"use client";

import AuthWrapper from "@/components/auth/AuthWrapper";
import Dashboard from "@/components/auth/Dashboard";

export default function Home() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  );
}