import type { PropsWithChildren } from "react";
import { useCan } from "../hooks/useCan";

type IfCanProps = PropsWithChildren<{ permission: string }>;

export const IfCan = ({ permission, children }: IfCanProps) => {
  const allowed = useCan(permission);
  return allowed ? <>{children}</> : null;
};
