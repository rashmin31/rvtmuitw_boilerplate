import { useState } from "react";
import { Link } from "react-router-dom";
import { AppButton, AppInput, useToast } from "@shared";
import { useAuth, useTenant } from "@modules";
import { Box, Stack, Typography } from "@mui/material";

export const LoginPage = () => {
  const { login } = useAuth();
  const { tenant } = useTenant();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await login(email, password);
      showToast({ message: "Welcome back", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4">{tenant.name} Login</Typography>
        <AppInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <AppInput
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AppButton onClick={onSubmit}>Login</AppButton>
        <Stack direction="row" spacing={2}>
          <Link to="/forgot-password">Forgot Password</Link>
          {tenant.featureFlags.registerEnabled && <Link to="/register">Register</Link>}
          {tenant.featureFlags.otpLogin && <Link to="/login-otp">Login via OTP</Link>}
        </Stack>
      </Stack>
    </Box>
  );
};
