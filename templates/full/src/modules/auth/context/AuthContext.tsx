import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AuthState, AuthUser } from "@modules";
import { authApi } from "@modules";

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const authenticated = await authApi.login(email, password);
        setUser(authenticated);
      },
      requestOtp: async (email) => {
        await authApi.requestOtp(email);
      },
      verifyOtp: async (email, code) => {
        const authenticated = await authApi.verifyOtp(email, code);
        setUser(authenticated);
      },
      register: async (name, email) => {
        const registered = await authApi.register(name, email);
        setUser(registered);
      },
      forgotPassword: async (email) => {
        await authApi.forgotPassword(email);
      },
      resetPassword: async (password) => {
        await authApi.resetPassword(password);
      },
      logout: async () => {
        await authApi.logout();
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
