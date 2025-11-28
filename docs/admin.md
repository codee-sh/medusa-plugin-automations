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

- **Rule Attributes**: Select from available attributes (e.g., `inventory_level.available_quantity`)
- **Operators**: Choose comparison operators (equals, greater than, less than, contains, in, etc.)
- **Values**: Set values to compare against

#### Actions

When all rules pass, actions are executed:

- **Channels**: Configure delivery channels (email, slack, admin, etc.)
- **Metadata**: Add custom metadata for actions

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
   - Select rule attributes from available options
   - Choose operators
   - Set comparison values
   - Add multiple rules as needed
5. **Configure Actions**:
   - Set delivery channels
   - Add metadata if needed
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

### High Stock Alert

Create an automation for when inventory exceeds a certain level:

- **Trigger**: Event `inventory.inventory-level.updated`
- **Rule**: `inventory_level.stocked_quantity` is greater than `1000`
- **Action**: Send admin notification

### Scheduled Inventory Report

Create a scheduled automation that runs periodically:

- **Trigger**: Schedule with interval of `1440` minutes (daily)
- **Rules**: Configure conditions for what to include in the report
- **Action**: Generate and send inventory report

## Best Practices

1. **Use Descriptive Names**: Give automations clear, descriptive names
2. **Test Rules**: Verify that rules work as expected before activating
3. **Monitor Performance**: Keep an eye on automation execution and performance
4. **Use Appropriate Triggers**: Choose the right trigger type for your use case
5. **Combine Rules**: Use multiple rules to create complex conditions
6. **Document Automations**: Add descriptions to explain automation purpose