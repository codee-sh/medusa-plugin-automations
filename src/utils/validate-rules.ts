import { pickValueFromObject, MathBN, isString } from "@medusajs/framework/utils"
import { NotificationRule } from '../modules/mpn-automation/interfaces'

/**
 * Validates a single rule value condition based on operator
 */
export function validateRuleValueCondition(
  ruleValues: string[],
  operator: string,
  ruleValuesToCheck: (string | number)[] | (string | number)
): boolean {
  const valuesToCheck = Array.isArray(ruleValuesToCheck)
    ? ruleValuesToCheck
    : [ruleValuesToCheck]

  // Strict validation: if no values to check or any value is undefined/null, return false
  if (!valuesToCheck.length) {
    return false
  }

  // Check if any value is undefined or null - this prevents bugs where attribute path is wrong
  const hasInvalidValues = valuesToCheck.some((val) => val === undefined || val === null)
  if (hasInvalidValues) {
    console.warn("Rule validation failed: valuesToCheck contains undefined or null values", {
      valuesToCheck,
      ruleValues,
      operator,
    })
    return false
  }

  switch (operator) {
    case "eq": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.every((val) => ruleValueSet.has(`${val}`))
    }
    case "in": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.some((val) => ruleValueSet.has(`${val}`))
    }
    case "ne": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.every((val) => !ruleValueSet.has(`${val}`))
    }
    case "gt":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.gt(val, ruleVal))
      )
    case "gte":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.gte(val, ruleVal))
      )
    case "lt":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.lt(val, ruleVal))
      )
    case "lte":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.lte(val, ruleVal))
      )
    default:
      return false
  }
}

/**
 * Validates rules for the given context.
 */
export function validateRulesForContext(
  rules: NotificationRule[],
  context: Record<string, any>
): boolean {
  if (!rules?.length) {
    return true
  }

  return rules.every((rule) => {
    if (!rule.attribute || !rule.rule_values?.length) {
      return false
    }

    const validRuleValues: string[] = []
    for (const value of rule.rule_values) {
      if (value.value && isString(value.value)) {
        validRuleValues.push(value.value)
      }
    }

    if (!validRuleValues.length) {
      return false
    }

    // Get value from context based on rule attribute
    // e.g. "inventory_level.stocked_quantity" or "inventory_item.stocked_quantity"
    const valuesToCheck = pickValueFromObject(rule.attribute, context)
    
    console.log("Rule evaluation:", {
      attribute: rule.attribute,
      operator: rule.operator,
      ruleValues: validRuleValues,
      valuesToCheck: valuesToCheck,
      contextKeys: Object.keys(context),
    })

    return validateRuleValueCondition(
      validRuleValues,
      rule.operator,
      valuesToCheck
    )
  })
}

