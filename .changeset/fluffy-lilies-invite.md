---
"@codee-sh/medusa-plugin-automations": patch
---

Improve automation action services and template handling.

- add context transformation support for email actions via `@codee-sh/medusa-plugin-notification-emails`
- improve template selection by introducing external template options and `fillTemplateNameFieldWithOptions`
- enhance admin action configuration with grouped options support in `SelectField`
- refactor email/slack action services to use more flexible typing and remove unused template registration logic
- clean up deprecated Slack template resources and internal service wiring
