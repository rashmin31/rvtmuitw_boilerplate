import { useState } from "react";
import { AppButton, AppInput, useToast } from "@shared";
import { useAuth } from "@modules";
import { Box, Stack, Typography } from "@mui/material";

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      await register(name, email);
      showToast({ message: "Account created", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4">Register</Typography>
        <AppInput label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <AppInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <AppButton onClick={onSubmit}>Register</AppButton>
      </Stack>
    </Box>
  );
};
