import { Box, Grid, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

export const SectionLayout = ({ title, description, children }: PropsWithChildren<{ title?: string; description?: string }>) => (
  <Box className="space-y-4">
    {title && <Typography variant="h6">{title}</Typography>}
    {description && <Typography color="text.secondary">{description}</Typography>}
    <Grid container spacing={2}>{children}</Grid>
  </Box>
);
