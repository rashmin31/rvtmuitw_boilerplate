import type { Role } from "@modules";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthState = {
  user: AuthUser | null;
};
