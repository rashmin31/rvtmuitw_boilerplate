import { Box, Stack, Typography } from "@mui/material";
import { AppButton, AppInput } from "@shared";

export const InviteUserPage = () => (
  <Box className="p-6">
    <Stack spacing={2} className="max-w-md">
      <Typography variant="h5">Invite User</Typography>
      <AppInput label="Email" />
      <AppButton>Send Invite</AppButton>
    </Stack>
  </Box>
);
