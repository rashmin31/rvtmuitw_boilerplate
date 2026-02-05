import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormSchema } from "./types";
import { isFieldVisible } from "../utils/visibility";
import { renderField } from "./fieldRegistry";
import { SectionLayout } from "../layout/SectionLayout";
import { AppButton } from "@shared";

type FormRendererProps = {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
};

export const FormRenderer = ({
  schema,
  onSubmit,
  defaultValues,
  submitLabel = "Submit"
}: FormRendererProps) => {
  const form = useForm({
    defaultValues,
    resolver: schema.validationSchema ? zodResolver(schema.validationSchema) : undefined
  });
  const values = form.watch();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {schema.sections.map((section, index) => (
          <SectionLayout key={index} title={section.title} description={section.description}>
            {section.fields
              .filter((field) => isFieldVisible(field, values))
              .map((field) => (
                <Grid item xs={12} md={field.colSpan ?? 6} key={field.name}>
                  <Controller
                    name={field.name}
                    control={form.control}
                    render={({ field: controllerField }) =>
                      renderField(field, {
                        value: controllerField.value,
                        onChange: controllerField.onChange,
                        onBlur: controllerField.onBlur
                      })
                    }
                  />
                </Grid>
              ))}
          </SectionLayout>
        ))}
        <div>
          <AppButton type="submit">{submitLabel}</AppButton>
        </div>
      </div>
    </form>
  );
};
