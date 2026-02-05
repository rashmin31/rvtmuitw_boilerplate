import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuth } from "@modules";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
