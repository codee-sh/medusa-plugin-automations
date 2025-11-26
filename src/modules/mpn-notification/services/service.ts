import { MedusaService } from "@medusajs/framework/utils";
import { MpnNotificationTrigger, MpnNotificationRule, MpnNotificationRuleValue } from "../models";

class MpnNotificationService extends MedusaService({
  MpnNotificationTrigger,
  MpnNotificationRule,
  MpnNotificationRuleValue
}) {
  // TODO implement custom methods
}

export default MpnNotificationService;
