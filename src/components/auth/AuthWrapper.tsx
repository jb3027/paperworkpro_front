"use client";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { ReactNode } from "react";
import AuthPage from "./AuthPage";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useKindeAuth();

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loader-container">
            <div className="loader"></div>
            <p style={{ marginTop: '20px', color: '#f5f5f5' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <>{children}</>;
}