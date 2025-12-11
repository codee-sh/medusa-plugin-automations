import {
  Button,
  FocusModal,
  ProgressTabs,
  toast,
} from "@medusajs/ui"
import { Pencil } from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  useEditAutomation,
  useListAutomations,
} from "../../../../hooks/api/automations"
import {
  useListAutomationsRules,
  useEditAutomationRule,
} from "../../../../hooks/api/automations-rules"
import {
  useListAutomationsActions,
  useEditAutomationAction,
} from "../../../../hooks/api/automations-actions"
import { useAvailableActions } from "../../../../hooks/api/available-actions"
import { AutomationsGeneralForm } from "../automations-general-form"
import { AutomationsRulesForm } from "../automations-rules-form"
import {
  AutomationFormValues,
  Tab,
  TabState,
} from "../types"
import { createAutomationFormSchema } from "../utils/automation-form-schema"
import { AutomationsActionsForm } from "../automations-actions-form"

export function AutomationsEditForm({
  id,
}: {
  id: string
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(Tab.GENERAL)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.GENERAL]: "in-progress",
    [Tab.RULES]: "not-started",
    [Tab.ACTIONS]: "not-started",
  })
  const [buttonText, setButtonText] = useState<string>("")

  useEffect(() => {
    if (Tab.GENERAL === tab) {
      setButtonText("Save automation")
    } else if (Tab.RULES === tab) {
      setButtonText("Save rules")
    } else if (Tab.ACTIONS === tab) {
      setButtonText("Save actions")
    }
  }, [tab])

  const queryClient = useQueryClient()

  const {
    data: automationsTriggerData,
    isLoading: isAutomationsTriggerLoading,
  } = useListAutomations({
    id: id,
    extraKey: [],
    enabled: open && !!id,
  })

  const {
    data: automationsRulesData,
    isLoading: isAutomationsRulesLoading,
  } = useListAutomationsRules({
    trigger_id: id,
    extraKey: [id],
    enabled: open && !!id,
  })

  const {
    data: automationsActionsData,
    isLoading: isAutomationsActionsLoading,
    refetch: refetchActions,
  } = useListAutomationsActions({
    trigger_id: id,
    extraKey: [id],
    enabled: open && !!id,
  })

  const { data: availableActionsData } =
    useAvailableActions({
      enabled: open,
    })
    
  const {
    mutateAsync: editAutomation,
    isPending: isEditAutomationPending,
  } = useEditAutomation()
  const {
    mutateAsync: editAutomationRule,
    isPending: isEditAutomationRulePending,
  } = useEditAutomationRule()
  const {
    mutateAsync: editAutomationAction,
    isPending: isEditAutomationActionPending,
  } = useEditAutomationAction()

  // Create dynamic schema with superRefine based on availableActions
  const automationFormSchema = useMemo(() => {
    return createAutomationFormSchema(
      availableActionsData?.actions
    )
  }, [availableActionsData?.actions])

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      general: {
        name: "",
        description: "",
        trigger_type: "event",
        event_name: "",
        interval_minutes: null,
        active: false,
      },
      rules: {
        items: [],
      },
      actions: {
        items: [],
      },
    },
  })

  // Update form when data is loaded and modal is open
  useEffect(() => {
    if (
      automationsTriggerData &&
      automationsTriggerData.triggers?.[0]
    ) {
      const trigger = automationsTriggerData.triggers[0]
      const rules = automationsRulesData?.rules || []
      const actions = automationsActionsData?.actions || []

      form.reset({
        general: {
          name: trigger.name || "",
          description: trigger.description || "",
          trigger_type: trigger.trigger_type || "event",
          event_name: trigger.event_name || "",
          interval_minutes:
            trigger.interval_minutes || null,
          active: trigger.active || false,
        },
        rules: {
          items: rules.map((rule: any) => ({
            id: rule.id,
            attribute: rule.attribute,
            operator: rule.operator,
            description: rule.description,
            metadata: rule.metadata,
            rule_values: rule.rule_values.map(
              (value: any) => ({
                id: value.id,
                value: value.value,
                metadata: value.metadata,
              })
            ),
          })),
        },
        actions: {
          items: actions.map((action: any) => ({
            id: action.id,
            action_type: action.action_type,
            config: action.config,
          })),
        },
      })
    }
  }, [open, automationsTriggerData, automationsRulesData, automationsActionsData])

  // Reset form when modal is closed
  useEffect(() => {
    if (open === false) {
      form.reset({
        general: {
          name: "",
          description: "",
          trigger_type: "event",
          event_name: "",
          interval_minutes: null,
          active: false,
        },
        rules: {
          items: [],
        },
        actions: {
          items: [],
        },
      })
    }
  }, [open])

  async function handleSubmit(data: AutomationFormValues) {
    if (Tab.GENERAL === tab) {
      const items = {
        id: id,
        name: data.general.name,
        description: data.general.description,
        trigger_type: data.general.trigger_type,
        event_name: data.general.event_name,
        interval_minutes: data.general.interval_minutes,
        active: data.general.active,
      }

      await editAutomation({
        id: id,
        items: [items],
      })

      queryClient.invalidateQueries({
        queryKey: ["automations"],
      })

      toast.success("Automation updated successfully", {
        position: "top-right",
        duration: 3000,
      })
    }

    if (Tab.RULES === tab) {
      const items = {
        trigger_id: id,
        rules: data.rules?.items || [],
      }

      const fieldsToValidate = getFieldsForTab(tab)
      const valid = await form.trigger(
        fieldsToValidate as any
      )

      if (!valid) {
        return
      }

      await editAutomationRule(items)

      queryClient.invalidateQueries({
        queryKey: ["automations-rules", id],
      })

      toast.success(
        "Automation rules added/updated successfully",
        {
          position: "top-right",
          duration: 3000,
        }
      )
    }

    if (Tab.ACTIONS === tab) {
      const items = {
        trigger_id: id,
        actions: data.actions?.items || [],
      }
      
      await editAutomationAction(items)

      // Invalidate and refetch actions to get updated IDs
      queryClient.invalidateQueries({
        queryKey: ["automations-actions", id],
      })
      
      // Refetch actions to get updated data with IDs
      await refetchActions()

      toast.success(
        "Automation actions added/updated successfully",
        {
          position: "top-right",
          duration: 3000,
        }
      )
    }
  }

  const getFieldsForTab = (tab: Tab): string[] => {
    switch (tab) {
      case Tab.GENERAL:
        return [
          "general.name",
          "general.description",
          "general.event_name",
        ]
      case Tab.RULES:
        return ["rules.items"]
      case Tab.ACTIONS:
        return ["actions.items"]
      default:
        return []
    }
  }

  const handleTabChange = async (newTab: string) => {
    const fieldsToValidate = getFieldsForTab(tab)
    const valid = await form.trigger(
      fieldsToValidate as any
    )

    if (!valid) {
      return
    }

    setTabState((prev) => ({
      ...prev,
      [tab]: "completed",
      [newTab]: "in-progress",
    }))

    setTab(newTab as Tab)
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button size="small" variant="primary">
          <Pencil />
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            Edit Automation
          </FocusModal.Title>
          <div className="-my-2 w-full border-l">
            <ProgressTabs
              dir="ltr"
              value={tab}
              className="flex h-full flex-col overflow-hidden"
            >
              <ProgressTabs.List className="justify-start-start flex w-full items-center">
                <ProgressTabs.Trigger
                  value={Tab.GENERAL}
                  status={tabState[Tab.GENERAL]}
                  onClick={() =>
                    handleTabChange(Tab.GENERAL)
                  }
                >
                  General
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  value={Tab.RULES}
                  status={tabState[Tab.RULES]}
                  onClick={() => handleTabChange(Tab.RULES)}
                >
                  Rules
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  value={Tab.ACTIONS}
                  status={tabState[Tab.ACTIONS]}
                  onClick={() =>
                    handleTabChange(Tab.ACTIONS)
                  }
                >
                  Actions
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </ProgressTabs>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="w-full overflow-y-auto">
          {isAutomationsTriggerLoading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {tab === Tab.GENERAL && (
                <AutomationsGeneralForm
                  form={form}
                  isOpen={open}
                />
              )}
              {tab === Tab.RULES && (
                <AutomationsRulesForm
                  form={form}
                  isOpen={open}
                />
              )}
              {tab === Tab.ACTIONS && (
                <AutomationsActionsForm
                  form={form}
                  isOpen={open}
                />
              )}
            </form>
          )}
        </FocusModal.Body>
        <FocusModal.Footer>
          <FocusModal.Close asChild>
            <Button size="small" variant="secondary">
              Cancel
            </Button>
          </FocusModal.Close>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={
              isEditAutomationPending ||
              isAutomationsTriggerLoading ||
              isEditAutomationRulePending ||
              isEditAutomationActionPending
            }
            isLoading={
              isEditAutomationPending ||
              isEditAutomationRulePending ||
              isAutomationsRulesLoading ||
              isAutomationsActionsLoading
            }
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}
