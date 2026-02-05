import { Box, Stack, Typography } from "@mui/material";
import { DataTable, AppButton } from "@shared";
import { IfCan } from "@modules";

const rows = [
  { name: "Admin", email: "admin@inverixo.io" },
  { name: "Viewer", email: "viewer@inverixo.io" }
];

export const UsersListPage = () => (
  <Box className="p-6">
    <Stack spacing={2}>
      <Typography variant="h5">Users</Typography>
      <IfCan permission="users:invite">
        <AppButton>Invite User</AppButton>
      </IfCan>
      <DataTable
        data={rows}
        columns={[
          { header: "Name", accessor: (row) => row.name },
          { header: "Email", accessor: (row) => row.email }
        ]}
      />
    </Stack>
  </Box>
);
