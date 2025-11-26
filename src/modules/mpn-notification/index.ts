import { Module } from "@medusajs/framework/utils"
import { MpnNotificationService } from "./services"

export const MPN_NOTIFICATION_TRIGGER_MODULE = "mpnNotification"

export default Module(MPN_NOTIFICATION_TRIGGER_MODULE, {
  service: MpnNotificationService,
  // loaders: [PosLoader]
})