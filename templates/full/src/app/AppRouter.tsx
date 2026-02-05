import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AuthRoutes, ProtectedRoute } from "@modules";
import { TenantLayout } from "@tenants";
import { UsersRoutes } from "@modules";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TenantLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/users" replace /> },
      ...UsersRoutes
    ]
  },
  ...AuthRoutes
]);

export const AppRouter = () => <RouterProvider router={router} />;
