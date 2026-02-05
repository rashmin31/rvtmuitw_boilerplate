import type { PropsWithChildren } from "react";
import { useCan } from "../hooks/useCan";

type CanIAccessProps = PropsWithChildren<{ permission: string }>;

export const CanIAccess = ({ permission, children }: CanIAccessProps) => {
  const allowed = useCan(permission);
  return allowed ? <>{children}</> : null;
};
