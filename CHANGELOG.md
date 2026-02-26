# @codee-sh/medusa-plugin-automations

## 1.0.11

### Patch Changes

- dd40d44: Add skills and agents
- f9cf002: Add changeset

## 1.0.10

### Patch Changes

- 94a205a: Improve automation action services and template handling.
  - add context transformation support for email actions via `@codee-sh/medusa-plugin-notification-emails`
  - improve template selection by introducing external template options and `fillTemplateNameFieldWithOptions`
  - enhance admin action configuration with grouped options support in `SelectField`
  - refactor email/slack action services to use more flexible typing and remove unused template registration logic
  - clean up deprecated Slack template resources and internal service wiring

## 1.0.9

### Patch Changes

- 9089a49: Add transformContext from -emails plugin
- 50fd1f5: Replace the Slack templates with external plugin

## 1.0.8

### Patch Changes

- 0f4640f: update ORDER_ATTRIBUTES to ORDER_QUERY_FIELDS for improved totals calculation and UI consistency
- 5eb910c: Update contributing
- 9d7690f: Update in the column name
- 03b493a: feat: Add throttle support for event triggers

## 1.0.7

### Patch Changes

- 9a31b8e: Add array operators, relation support, and documentation updates
- 901b9d7: Update the fixes with import template module
- 8799a52: Clean files by prettier
