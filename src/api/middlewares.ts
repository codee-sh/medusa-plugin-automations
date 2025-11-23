import {   
  errorHandler, 
  MedusaNextFunction, 
  MedusaRequest, 
  MedusaResponse, authenticate, defineMiddlewares, validateAndTransformBody, validateAndTransformQuery, maybeApplyLinkFilter } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const AdminNotificationListParams = createFindParams().extend({
  resource_id: z.string().optional(),
  resource_type: z.string().optional(),
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/notification-plugin/notifications",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(AdminNotificationListParams, {
          defaults: [
            "id",
            "to",
            "channel",
            "created_at",
            "status",
            "template",
            "trigger_type",
            "resource_id",
            "resource_type",
            "receiver_id",
            "original_notification_id",
            "external_id",
            "provider_id",
          ],
          isList: true,
        }),
      ],
    },
  ],
})
