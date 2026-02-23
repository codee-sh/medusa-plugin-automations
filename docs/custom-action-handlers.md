# Custom Action Handlers

How to create and register custom action handlers.

## Example

```typescript
import { ActionHandler } from "@codee-sh/medusa-plugin-automations/modules/mpn-automation/types/action-handler"

class CustomActionHandler implements ActionHandler {
  id = "custom-action"
  label = "Custom Action"
  description = "Performs a custom action"

  async executeAction({ action, context, container }) {
    // Your custom logic here
    return {
      success: true,
      message: "Custom action executed"
    }
  }
}

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-automations",
      options: {
        automations: {
          actionHandlers: [
            new CustomActionHandler()
          ],
          actionsEnabled: {
            "custom-action": true
          }
        }
      }
    }
  ]
})
```

## See Also

- [Configuration](./configuration.md)
