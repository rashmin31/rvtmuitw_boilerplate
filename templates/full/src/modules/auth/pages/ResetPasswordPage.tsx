import { useState } from "react";
import { AppButton, AppInput, useToast } from "@shared";
import { useAuth } from "@modules";
import { Box, Stack, Typography } from "@mui/material";

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await resetPassword(password);
      showToast({ message: "Password updated", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4">Reset Password</Typography>
        <AppInput
          label="New Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AppButton onClick={onSubmit}>Reset Password</AppButton>
      </Stack>
    </Box>
  );
};
