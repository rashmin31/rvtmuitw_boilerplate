import type { ZodSchema } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "password"
  | "textarea"
  | "number"
  | "select"
  | "asyncSelect"
  | "checkbox"
  | "switch"
  | "radio"
  | "currency"
  | "otp";

export type Option = { label: string; value: string };

type VisibilityRule =
  | { type: "equals"; field: string; value: unknown }
  | { type: "notEquals"; field: string; value: unknown }
  | { type: "in"; field: string; value: unknown[] }
  | { type: "custom"; fn: (values: Record<string, unknown>) => boolean };

export type FieldSchema = {
  name: string;
  label: string;
  type: FieldType;
  colSpan?: number;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  rules?: VisibilityRule[];
};

export type SectionSchema = {
  title?: string;
  description?: string;
  fields: FieldSchema[];
};

export type FormSchema = {
  sections: SectionSchema[];
  validationSchema?: ZodSchema;
};
