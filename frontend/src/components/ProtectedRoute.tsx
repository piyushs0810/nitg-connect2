import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // ❌ Not logged in
  if (!isAuthenticated) {
    if (loading) {
      return <div className="text-center mt-10">Loading...</div>;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return <>{children}</>;
}