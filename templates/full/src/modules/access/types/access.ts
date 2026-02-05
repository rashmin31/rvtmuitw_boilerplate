export type Permission = string;

export type Role = "admin" | "manager" | "viewer";

export type AccessState = {
  permissions: Permission[];
};
