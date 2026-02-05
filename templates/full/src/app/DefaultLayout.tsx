import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

export const DefaultLayout = () => (
  <Box className="min-h-screen">
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Inverixo App</Typography>
      </Toolbar>
    </AppBar>
    <Outlet />
  </Box>
);
