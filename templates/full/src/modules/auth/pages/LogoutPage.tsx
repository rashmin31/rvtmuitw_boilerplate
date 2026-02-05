import { useEffect } from "react";
import { useAuth } from "@modules";
import { Box, CircularProgress, Typography } from "@mui/material";

export const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    void logout();
  }, [logout]);

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center gap-4">
      <CircularProgress />
      <Typography>Signing you out...</Typography>
    </Box>
  );
};
