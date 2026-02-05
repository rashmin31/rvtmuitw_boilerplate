import type { ThemeOptions } from "@mui/material/styles";

type FeatureFlags = {
  otpLogin: boolean;
  registerEnabled: boolean;
};

type AuthOptions = {
  loginMethods: Array<"password" | "otp">;
};

export type TenantConfig = {
  tenantId: string;
  name: string;
  domains: string[];
  layoutKey: string;
  theme: ThemeOptions;
  featureFlags: FeatureFlags;
  auth: AuthOptions;
};
