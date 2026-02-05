import { CssBaseline, ThemeProvider } from "@mui/material";
import { AccessProvider, AuthProvider, TenantProvider, useTenant } from "@modules";
import type { PropsWithChildren } from "react";
import { AppToastProvider } from "@shared";

const TenantThemeProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTenant();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <TenantProvider>
    <AuthProvider>
      <AccessProvider>
        <TenantThemeProvider>
          <CssBaseline />
          <AppToastProvider>{children}</AppToastProvider>
        </TenantThemeProvider>
      </AccessProvider>
    </AuthProvider>
  </TenantProvider>
);
