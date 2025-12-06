import {   
  errorHandler, 
  MedusaNextFunction, 
  MedusaRequest, 
  MedusaResponse, authenticate, defineMiddlewares, validateAndTransformBody, validateAndTransformQuery, maybeApplyLinkFilter } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const AdminAutomationsListParams = createFindParams().extend({
  id: z.string().optional(),
})

export const AdminAutomationsRulesListParams = createFindParams().extend({
  id: z.string().optional(),
  trigger_id: z.string().optional(),
})

export const AdminAutomationsActionsListParams = createFindParams().extend({
  id: z.string().optional(),
  trigger_id: z.string().optional(),
})  

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/mpn/automations/available-events",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
      ],
    },
    {
      matcher: "/admin/mpn/automations/available-actions",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
      ],
    },
    {
      matcher: "/admin/mpn/automations/available-triggers",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
      ],
    },
    {
      matcher: "/admin/mpn/automations/rules",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(AdminAutomationsRulesListParams, {
          defaults: [
            "id",
            "trigger_id",
            "attribute",
            "operator",
            "description",
            "position",
            "metadata",
            "created_at",
            "updated_at",
            "rule_values.*"
          ],
          isList: true,
        }),        
      ],
    },
    {
      matcher: "/admin/mpn/automations/actions",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(AdminAutomationsActionsListParams, {
          defaults: [
            "id",
            "trigger_id",
            "action_type",
            "config",
            "position",
            "metadata",
            "active",
            "created_at",
            "updated_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/mpn/automations",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(AdminAutomationsListParams, {
          defaults: [
            "id",
            "name",
            "description",
            "trigger_id",
            "trigger_type",
            "event_name",
            "interval_minutes",
            "last_run_at",
            "channels",
            "metadata",
            "active",
            "created_at",
            "updated_at",
            "rules.*",
            "rules.rule_values.*",
            "actions.*",
            "actions.config.*"
          ],
          isList: true,
        }),
      ],
    },
  ],
})
