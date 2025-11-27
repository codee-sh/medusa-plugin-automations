import { MedusaService, MedusaContext } from "@medusajs/framework/utils";
import { MpnAutomationTrigger, MpnAutomationState, MpnAutomationRule, MpnAutomationRuleValue } from "../models";

class MpnAutomationService extends MedusaService({
  MpnAutomationTrigger,
  MpnAutomationState,
  MpnAutomationRule,
  MpnAutomationRuleValue
}) {

  // Override listMpnAutomations to use internal service's list method
  // @ts-ignore
  // async listMpnAutomations(
  //   filters?: any,
  //   config?: FindConfig<any> | undefined,
  //   @MedusaContext() sharedContext?: Context | undefined
  // ) {
  //   // Use the internal service's list method
  //   return await this.mpnAutomationService_.list(filters, config, sharedContext);
  // }
}

export default MpnAutomationService;
