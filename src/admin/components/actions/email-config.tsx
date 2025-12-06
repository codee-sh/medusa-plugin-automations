import { Label, Input, Textarea } from "@medusajs/ui"
import { Controller } from "react-hook-form"
import { ActionConfigComponentProps } from "../../../modules/mpn-automation/types/action-handler"

function EmailConfigComponent({
  control,
  name,
  errors,
}: ActionConfigComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <Controller
        name={`${name}.to` as any}
        control={control}
        defaultValue=""
        shouldUnregister={false}
        render={({ field, fieldState }) => (
          <div>
            <Label>To</Label>
            <Input
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
              }}
              onBlur={field.onBlur}
              placeholder="recipient@example.com"
            />
            {(fieldState.error || errors?.to) && (
              <span className="text-red-500 text-sm">
                {fieldState.error?.message || errors?.to}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={`${name}.subject` as any}
        control={control}
        defaultValue=""
        shouldUnregister={false}
        render={({ field, fieldState }) => (
          <div>
            <Label>Subject</Label>
            <Input
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
              }}
              onBlur={field.onBlur}
              placeholder="Email subject"
            />
            {(fieldState.error || errors?.subject) && (
              <span className="text-red-500 text-sm">
                {fieldState.error?.message || errors?.subject}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={`${name}.body` as any}
        control={control}
        defaultValue=""
        shouldUnregister={false}
        render={({ field }) => (
          <div>
            <Label>Body</Label>
            <Textarea
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
              }}
              onBlur={field.onBlur}
              placeholder="Email body"
              rows={5}
            />
          </div>
        )}
      />
    </div>
  )
}

// Export as default for dynamic import
export default EmailConfigComponent

// Also export as named export for backward compatibility
export { EmailConfigComponent }
