import { z } from "zod";
import { FormRenderer } from "@modules";
import type { FormSchema } from "@modules";
import { Box } from "@mui/material";

const schema: FormSchema = {
  validationSchema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    status: z.string()
  }),
  sections: [
    {
      title: "Customer",
      fields: [
        { name: "name", label: "Name", type: "text", colSpan: 6 },
        { name: "email", label: "Email", type: "email", colSpan: 6 },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
          ],
          colSpan: 6
        }
      ]
    }
  ]
};

export const CustomerCreateFormExample = () => (
  <Box className="p-6">
    <FormRenderer schema={schema} onSubmit={(values) => console.log(values)} />
  </Box>
);
