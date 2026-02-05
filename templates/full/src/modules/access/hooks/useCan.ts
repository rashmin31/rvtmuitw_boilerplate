import { useMemo } from "react";
import { useAccess } from "../context/AccessContext";
import { can } from "../rbac/can";

export const useCan = (permission: string) => {
  const { permissions } = useAccess();
  return useMemo(() => can(permissions, permission), [permissions, permission]);
};
