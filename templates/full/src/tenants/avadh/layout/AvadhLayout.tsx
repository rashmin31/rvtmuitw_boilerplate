import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { useTenant } from "@modules";

export const AvadhLayout = () => {
  const { tenant } = useTenant();
  return (
    <Box className="min-h-screen">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">{tenant.name} Workspace</Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
};
