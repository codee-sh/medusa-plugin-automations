import { Module } from "@medusajs/framework/utils"
import { MpnAutomationService } from "./services"

export const MPN_AUTOMATION_MODULE = "mpnAutomation"

export default Module(MPN_AUTOMATION_MODULE, {
  service: MpnAutomationService,
})
