import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authAPI.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await authAPI.verifyToken(token);
        setIsAuthenticated(true);
      } catch (error) {
        authAPI.logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Wait for auth check
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return <>{children}</>;
}