import { Label, Input, Textarea } from "@medusajs/ui";
import { Controller } from "react-hook-form";
import { ActionConfigComponentProps } from "../../../modules/mpn-automation/types/action-handler";

function BaseConfigComponent({
  form,
  fields,
  name,
  errors,
}: ActionConfigComponentProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {fields.map((group: any) => (
          <Controller
            key={group.name || group.key}
            name={`${name}.${group.name}` as any}
            control={form.control}
            defaultValue=""
            shouldUnregister={false}         
            render={({ field, fieldState }) => {
              const isRequired = group.required === true
              
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value
                field.onChange(newValue)
              }
              
              return (
                <div>
                  <Label>
                    {group.label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    value={field.value ?? ""}
                    onChange={handleChange}
                    placeholder={group.placeholder}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[group.name] && !fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {errors[group.name]}
                    </span>
                  )}
                </div>
              )
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Export as default for dynamic import
export default BaseConfigComponent;

// Also export as named export for backward compatibility
export { BaseConfigComponent };
