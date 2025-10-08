"use client";

import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function AuthPage() {
  return (
    <div id="logged_out_view" className="auth-container">
      <div className="auth-card">
        <div className="app-icon">
          <i className="fas fa-film"></i>
        </div>
        <h1 className="app-title">PaperworkPro</h1>
        <p className="app-subtitle">Professional script management</p>
        
        <div className="auth-buttons">
          <LoginLink className="btn-primary">
            <i className="fas fa-user"></i>
            Sign In
          </LoginLink>
          <RegisterLink className="btn-secondary">
            <i className="fas fa-user-plus"></i>
            Create Account
          </RegisterLink>
        </div>
        
        <div className="security-note">
          <i className="fas fa-shield-alt"></i>
          <span>Secured with Kinde authentication</span>
        </div>
      </div>
    </div>
  );
}