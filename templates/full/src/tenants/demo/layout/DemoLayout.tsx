import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { useTenant } from "@modules";

export const DemoLayout = () => {
  const { tenant } = useTenant();
  return (
    <Box className="min-h-screen">
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6">{tenant.name} Portal</Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
};
