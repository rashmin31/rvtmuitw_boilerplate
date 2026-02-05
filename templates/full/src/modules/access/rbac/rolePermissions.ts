import type { Permission, Role } from "../types/access";

export const rolePermissions: Record<Role, Permission[]> = {
  admin: ["users:read", "users:invite", "users:delete"],
  manager: ["users:read", "users:invite"],
  viewer: ["users:read"]
};
