import type { Permission } from "../types/access";

export const can = (permissions: Permission[], permission: Permission) =>
  permissions.includes(permission);
