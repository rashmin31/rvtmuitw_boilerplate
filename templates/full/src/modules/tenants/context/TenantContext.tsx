import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { resolveTenant } from "../resolver/TenantResolver";
import { createAppTheme } from "@shared";
import type { TenantConfig } from "../types/tenant";

type TenantContextValue = {
  tenant: TenantConfig;
  theme: ReturnType<typeof createAppTheme>;
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export const TenantProvider = ({ children }: PropsWithChildren) => {
  const tenant = resolveTenant(window.location);
  const theme = useMemo(() => createAppTheme(tenant.theme), [tenant.theme]);
  return <TenantContext.Provider value={{ tenant, theme }}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
};
