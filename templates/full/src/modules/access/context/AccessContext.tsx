import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { rolePermissions } from "../rbac/rolePermissions";
import { useAuth } from "@modules";
import type { AccessState } from "../types/access";

const AccessContext = createContext<AccessState | undefined>(undefined);

export const AccessProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const permissions = useMemo(() => {
    if (!user) return [];
    return rolePermissions[user.role];
  }, [user]);

  return <AccessContext.Provider value={{ permissions }}>{children}</AccessContext.Provider>;
};

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess must be used within AccessProvider");
  }
  return context;
};
