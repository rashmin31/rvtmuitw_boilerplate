import { useState } from "react";
import { AppButton, AppInput, useToast } from "@shared";
import { useAuth } from "@modules";
import { Box, Stack, Typography } from "@mui/material";

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      await forgotPassword(email);
      showToast({ message: "Reset email sent", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4">Forgot Password</Typography>
        <AppInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <AppButton onClick={onSubmit}>Send Reset Link</AppButton>
      </Stack>
    </Box>
  );
};
