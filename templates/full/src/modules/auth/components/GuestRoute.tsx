import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuth } from "@modules";

export const GuestRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};
