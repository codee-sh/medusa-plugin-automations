# Admin Panel Documentation

The plugin provides an admin interface for managing notification automations.

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
- **Schedule**: Time-based triggers with configurable intervals (in minutes)
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

## Using the Admin Panel

### Creating an Automation

1. **Navigate to Automations**: Go to `/app/notifications/automations`
2. **Click Create**: Start creating a new automation
3. **Configure Trigger**:
   - Set trigger type (event, schedule, or manual)
   - If event: Select the event name
   - If schedule: Set interval in minutes
   - Set a name and description
4. **Add Rules**:
   - Select rule attributes from available options (including relations and nested objects)
   - Choose operators based on your needs:
     - Use `in` or `not in` for checking if a value exists in an array
     - Use `contains` or `not contains` for partial matches in arrays
     - Use `empty` or `not empty` to check for null/empty values
   - Set comparison values:
     - For array operators (`in`, `not in`, `contains`, `not contains`): Use the chip input to add multiple values
     - For basic operators: Enter a single value
     - For `empty`/`not empty`: No value input needed
   - Add multiple rules as needed (all rules must pass for the automation to trigger)
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

- **Trigger**: Event `product.product.updated`
- **Rule**: `product.tags.id` is `in` `[tag-premium, tag-featured]` (use chip input for multiple tag IDs)
- **Action**: Send Slack notification

### Category-Based Automation

Create an automation for products in specific categories:

- **Trigger**: Event `product.product.created`
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
7. **Choose the Right Operator**: 
   - Use `in`/`not in` for exact matches in arrays (e.g., checking if product has specific tags)
   - Use `contains`/`not contains` for partial matches (e.g., checking if category name contains a substring)
   - Use `empty`/`not empty` for null checks
8. **Use Array Values Correctly**: When using array operators (`in`, `not in`, `contains`, `not contains`), use the chip input to add multiple values
9. **Leverage Relations**: Use relation-based attributes (e.g., `product.tags.id`, `product.categories.name`) to create powerful automations based on related data