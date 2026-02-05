import type { TenantConfig } from "../types/tenant";

export const tenantConfigs: TenantConfig[] = [
  {
    tenantId: "base",
    name: "Base Tenant",
    domains: ["localhost"],
    layoutKey: "base",
    theme: {
      palette: { primary: { main: "#2563eb" } }
    },
    featureFlags: { otpLogin: true, registerEnabled: true },
    auth: { loginMethods: ["password", "otp"] }
  },
  {
    tenantId: "demo",
    name: "Demo Tenant",
    domains: ["demo.local"],
    layoutKey: "demo",
    theme: {
      palette: { primary: { main: "#f97316" } }
    },
    featureFlags: { otpLogin: false, registerEnabled: true },
    auth: { loginMethods: ["password"] }
  },
  {
    tenantId: "avadh",
    name: "Avadh Tenant",
    domains: ["avadh.local"],
    layoutKey: "avadh",
    theme: {
      palette: { primary: { main: "#0f766e" } }
    },
    featureFlags: { otpLogin: true, registerEnabled: false },
    auth: { loginMethods: ["otp"] }
  }
];
