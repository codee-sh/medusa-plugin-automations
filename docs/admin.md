# Admin Panel Documentation

User guide for managing automations in the admin panel.

## Accessing the Admin Panel

Navigate to **Notifications > Automations** in your Medusa Admin dashboard, or directly access:

```
/app/notifications/automations
```

## Features

### Automation Management

The admin panel allows you to:

1. **View All Automations**: See a list of all configured automations
2. **Create Automations**: Set up new notification automations
3. **Edit Automations**: Modify existing automation configurations
4. **Manage Triggers**: Configure when automations should be triggered
5. **Define Rules**: Set up conditions that must be met for notifications to be sent
6. **Configure Actions**: Define what happens when rules are met

### Automation Components

#### Triggers

Automations can be triggered by:

- **Events**: Medusa events (e.g., `inventory.inventory-level.updated`, `order.placed`)
- **Schedule**: Time-based triggers with configurable intervals in seconds
- **Manual**: Triggered manually from the admin panel

#### Rules

Each automation can have multiple rules that define conditions:

- **Rule Attributes**: Select from available attributes including:
  - Primitive fields: `product.title`, `inventory_level.available_quantity`
  - Relations: `product.tags.id`, `product.categories.name` (arrays)
  - Nested objects: `inventory_level.inventory_item.*`
- **Operators**: Choose comparison operators:
  - **Basic**: `equals`, `not equals`, `greater than`, `less than`, `greater than or equal`, `less than or equal`
  - **Array operations**: `in`, `not in`, `contains`, `not contains`
  - **Null checks**: `empty`, `not empty`
- **Values**: Set values to compare against:
  - **Single values**: Enter a single string or number (e.g., `10`, `"Electronics"`)
  - **Array values**: Use the chip input to add multiple values (e.g., tag IDs, category names)
  - **No value**: For `empty` and `not empty` operators, no value input is required

#### Actions

When all rules pass, actions are executed:

- **Channels**: Configure delivery channels (email, slack etc.)
- **Metadata**: Add custom config for actions

#### Template Selection

Email and Slack actions use a `Template Name` field.
The template list loads dynamically and is grouped
as `System`, `Database`, and `External`.

## Using the Admin Panel

### Creating an Automation

1. **Navigate to Automations**: Go to `/app/notifications/automations`
2. **Click Create**: Start creating a new automation
3. **Configure Trigger**: Set trigger type (event, schedule, or manual). If event, select the event name. If schedule, set interval in seconds. Set a name and description.
4. **Add Rules**: Select rule attributes, choose operators, and set values. For array operators, use the chip input. For `empty`/`not empty`, no value input is required. Add multiple rules as needed (all rules must pass for the automation to trigger).
5. **Configure Actions**:
   - Set delivery channels
   - Add config if needed
6. **Save**: Save the automation configuration

### Editing an Automation

1. **Select Automation**: Click on an automation from the list
2. **Modify Settings**: Update trigger, rules, or actions
3. **Save Changes**: Save the updated configuration

### Managing Automation State

- **Active/Inactive**: Toggle automations on or off
- **Last Run**: View when scheduled automations last ran
- **Status**: Monitor automation status and execution

## Automation Examples

### Low Stock Alert

Create an automation that sends a notification when inventory levels drop below a threshold:

- **Trigger**: Event `inventory.inventory-level.updated`
- **Rule**: `inventory_level.available_quantity` is less than `10`
- **Action**: Send email notification

### Product Tag Automation

Create an automation that triggers when a product has specific tags:

- **Trigger**: Event `product.updated`
- **Rule**: `product.tags.id` is `in` `[tag-premium, tag-featured]` (use chip input for multiple tag IDs)
- **Action**: Send Slack notification

### Category-Based Automation

Create an automation for products in specific categories:

- **Trigger**: Event `product.updated`
- **Rule**: `product.categories.name` contains `"Electronics"` (or use `in` operator with multiple category names)
- **Action**: Send email notification

### Empty Inventory Check

Create an automation that triggers when inventory is empty:

- **Trigger**: Event `inventory.inventory-level.updated`
- **Rule**: `inventory_level.available_quantity` is `empty`
- **Action**: Send Slack notification

### High Stock Alert

Create an automation for when inventory exceeds a certain level:

- **Trigger**: Event `inventory.inventory-level.updated`
- **Rule**: `inventory_level.stocked_quantity` is greater than `1000`
- **Action**: Send Slack notification

## Best Practices

1. **Use Descriptive Names**: Give automations clear, descriptive names
2. **Test Rules**: Verify that rules work as expected before activating
3. **Monitor Performance**: Keep an eye on automation execution and performance
4. **Use Appropriate Triggers**: Choose the right trigger type for your use case
5. **Combine Rules**: Use multiple rules to create complex conditions
6. **Document Automations**: Add descriptions to explain automation purpose
7. **Choose the Right Operator**: Use `in`/`not in` for exact array matches, `contains`/`not contains` for partial matches, and `empty`/`not empty` for null checks
8. **Use Array Values Correctly**: For array operators, use the chip input to add multiple values
9. **Leverage Relations**: Use relation-based attributes (e.g., `product.tags.id`, `product.categories.name`) to create powerful automations

## See Also

- [Configuration](./configuration.md)
