import type { FieldSchema } from "../builder/types";

export const isFieldVisible = (
  field: FieldSchema,
  values: Record<string, unknown>
) => {
  if (!field.rules || field.rules.length === 0) return true;
  return field.rules.every((rule) => {
    switch (rule.type) {
      case "equals":
        return values[rule.field] === rule.value;
      case "notEquals":
        return values[rule.field] !== rule.value;
      case "in":
        return rule.value.includes(values[rule.field]);
      case "custom":
        return rule.fn(values);
      default:
        return true;
    }
  });
};
