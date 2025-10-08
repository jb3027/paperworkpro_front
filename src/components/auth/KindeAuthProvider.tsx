"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { ReactNode } from "react";

interface KindeAuthProviderProps {
  children: ReactNode;
}

export default function KindeAuthProvider({ children }: KindeAuthProviderProps) {
  return (
    <KindeProvider
      clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID || "b6a6ec27637d4aa09c4e0e59992426da"}
      domain={process.env.NEXT_PUBLIC_KINDE_DOMAIN || "https://jbtest001.kinde.com"}
      redirectUri={process.env.NEXT_PUBLIC_KINDE_REDIRECT_URI || "http://localhost:3000"}
      postLogoutRedirectUri={process.env.NEXT_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000"}
    >
      {children}
    </KindeProvider>
  );
}
