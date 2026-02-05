import { Checkbox, FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";
import type { FieldSchema } from "./types";

export const renderField = (
  field: FieldSchema,
  fieldProps: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
  }
) => {
  const commonProps = {
    label: field.label,
    placeholder: field.placeholder,
    fullWidth: true
  };

  switch (field.type) {
    case "textarea":
      return (
        <TextField
          {...commonProps}
          multiline
          minRows={3}
          value={fieldProps.value ?? ""}
          onChange={(event) => fieldProps.onChange(event.target.value)}
          onBlur={fieldProps.onBlur}
        />
      );
    case "select":
      return (
        <TextField
          {...commonProps}
          select
          value={fieldProps.value ?? ""}
          onChange={(event) => fieldProps.onChange(event.target.value)}
          onBlur={fieldProps.onBlur}
        >
          {field.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(fieldProps.value)}
              onChange={(event) => fieldProps.onChange(event.target.checked)}
              onBlur={fieldProps.onBlur}
            />
          }
          label={field.label}
        />
      );
    case "switch":
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(fieldProps.value)}
              onChange={(event) => fieldProps.onChange(event.target.checked)}
              onBlur={fieldProps.onBlur}
            />
          }
          label={field.label}
        />
      );
    default:
      return (
        <TextField
          {...commonProps}
          type={field.type === "password" ? "password" : "text"}
          value={fieldProps.value ?? ""}
          onChange={(event) => fieldProps.onChange(event.target.value)}
          onBlur={fieldProps.onBlur}
        />
      );
  }
};
