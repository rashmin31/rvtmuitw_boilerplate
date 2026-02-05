import { useState } from "react";
import { AppButton, AppInput, useToast } from "@shared";
import { useAuth } from "@modules";
import { Box, Stack, Typography } from "@mui/material";

export const OtpLoginPage = () => {
  const { requestOtp, verifyOtp } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [requested, setRequested] = useState(false);

  const onRequest = async () => {
    try {
      await requestOtp(email);
      setRequested(true);
      showToast({ message: "OTP sent", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  const onVerify = async () => {
    try {
      await verifyOtp(email, otp);
      showToast({ message: "Logged in", severity: "success" });
    } catch (error) {
      showToast({ message: (error as Error).message, severity: "error" });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4">Login via OTP</Typography>
        <AppInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        {requested && (
          <AppInput label="OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
        )}
        <AppButton onClick={requested ? onVerify : onRequest}>
          {requested ? "Verify OTP" : "Request OTP"}
        </AppButton>
      </Stack>
    </Box>
  );
};
