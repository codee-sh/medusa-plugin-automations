import { Button, FocusModal, ProgressTabs, ProgressStatus } from "@medusajs/ui"
import { Pencil } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { useForm, FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditAutomation } from "../../../../hooks/api/automations"
import { useListAutomations } from "../../../../hooks/api/automations"
import { useQueryClient } from "@tanstack/react-query"
import { AutomationsEditGeneralForm } from "../automations-edit-general-form"
import { AutomationFormValues } from "../types"
import { automationFormSchema } from "../constants"
import { ChannelType } from "../../types"

enum Tab {
  GENERAL = "general",
  RULES = "rules",
  ACTIONS = "actions",
}

type TabState = Record<Tab, ProgressStatus>

export function AutomationsEditForm({ id }: { id: string }) {
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

  const { data: automationsTriggerData, isLoading: isAutomationsTriggerLoading } = useListAutomations({
    id: id,
    extraKey: [],
    enabled: open && !!id,
  })

  const { mutateAsync: editAutomation, isPending: isEditAutomationPending } = useEditAutomation()

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
        channels: {
          [ChannelType.EMAIL]: false,
          [ChannelType.SLACK]: false,
        }
      },
    },
  })

  useEffect(() => {
    if (automationsTriggerData && automationsTriggerData.triggers?.[0]) {
      const trigger = automationsTriggerData.triggers[0]
      form.reset({
        general: {
          name: trigger.name || "",
          description: trigger.description || "",
          trigger_type: trigger.trigger_type || "event",
          event_name: trigger.event_name || "",
          interval_minutes: trigger.interval_minutes || null,
          active: trigger.active || false,
          channels: (trigger.channels as Record<string, boolean>) || {
            [ChannelType.EMAIL]: false,
            [ChannelType.SLACK]: false,
          }
        },
      })
    }
  }, [automationsTriggerData, form])

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
        channels: data.general.channels,
      }

      await editAutomation({
        id: id,
        items: [items],
      })

      queryClient.invalidateQueries({ queryKey: ["automations"] })
      setOpen(false)
    }
  }

  function handleError(errors: FieldErrors<AutomationFormValues>) {
    console.log("Validation errors:", errors)
  }

  const getFieldsForTab = (tab: Tab): string[] => {
    switch(tab) {
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
    const valid = await form.trigger(fieldsToValidate as any)
    
    if (!valid) {
      return
    }
    
    setTabState(prev => ({
      ...prev,
      [tab]: "completed",
      [newTab]: "in-progress"
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
          <FocusModal.Title>Edit Automation</FocusModal.Title>
          <div className="-my-2 w-full border-l">
            <ProgressTabs
              dir="ltr"
              value={tab}
              className="flex h-full flex-col overflow-hidden"
            >
              <ProgressTabs.List className="justify-start-start flex w-full items-center">
                <ProgressTabs.Trigger value={Tab.GENERAL} status={tabState[Tab.GENERAL]} onClick={() => handleTabChange(Tab.GENERAL)}>
                  General
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger value={Tab.RULES} status={tabState[Tab.RULES]} onClick={() => handleTabChange(Tab.RULES)}>
                  Rules
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger value={Tab.ACTIONS} status={tabState[Tab.ACTIONS]} onClick={() => handleTabChange(Tab.ACTIONS)}>
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
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)}>
              {tab === Tab.GENERAL && <AutomationsEditGeneralForm form={form} />}
            </form>
          )}
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button 
            type="submit" 
            onClick={form.handleSubmit(handleSubmit, handleError)}
            disabled={isEditAutomationPending || isAutomationsTriggerLoading}
            isLoading={isEditAutomationPending}
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

