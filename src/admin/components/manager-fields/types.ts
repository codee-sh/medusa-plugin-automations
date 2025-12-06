export interface FieldConfig {
  key: string;
  label: string;
  description?: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "chip-input";
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
}
