import type { RouteObject } from "react-router-dom";
import { GuestRoute } from "@modules";
import {
  ForgotPasswordPage,
  LoginPage,
  LogoutPage,
  OtpLoginPage,
  RegisterPage,
  ResetPasswordPage
} from "@modules";

export const AuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    )
  },
  {
    path: "/login-otp",
    element: (
      <GuestRoute>
        <OtpLoginPage />
      </GuestRoute>
    )
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    )
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    )
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <ResetPasswordPage />
      </GuestRoute>
    )
  },
  {
    path: "/logout",
    element: <LogoutPage />
  }
];
