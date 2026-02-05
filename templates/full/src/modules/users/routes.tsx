import type { RouteObject } from "react-router-dom";
import { UsersListPage, InviteUserPage } from "@modules";
import { CanIAccess } from "@modules";

export const UsersRoutes: RouteObject[] = [
  { path: "/users", element: <UsersListPage /> },
  {
    path: "/users/invite",
    element: (
      <CanIAccess permission="users:invite">
        <InviteUserPage />
      </CanIAccess>
    )
  }
];
