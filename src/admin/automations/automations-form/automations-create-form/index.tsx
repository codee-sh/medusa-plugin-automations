import { Button, FocusModal, ProgressTabs, ProgressStatus, toast } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateAutomation, useListAutomations } from "../../../../hooks/api/automations"
import { useAvailableActions } from "../../../../hooks/api/available-actions"
import { AutomationsGeneralForm } from "../automations-general-form"
import { AutomationFormValues, Tab, TabState } from "../types"
import { createAutomationFormSchema } from "../utils/automation-form-schema"

export function AutomationsCreateForm({ id }: { id: string }) {
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

  const { data: availableActionsData } = useAvailableActions({
    enabled: open,
  })

  const { mutateAsync: createAutomation, isPending: isCreateAutomationPending } = useCreateAutomation()

  // Create dynamic schema with superRefine based on availableActions
  const automationFormSchema = useMemo(() => {
    return createAutomationFormSchema(availableActionsData?.actions)
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
        active: false
      },
      rules: {
        items: [],
      },
      actions: {
        items: [],
      },
    },
  })

  // Reset form when data is loaded and modal is open
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
        },
        rules: {
            items: [],
          },
          actions: {
            items: [],
          },
      })
    }
  }, [open, automationsTriggerData])

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
        name: data.general.name,
        description: data.general.description,
        trigger_type: data.general.trigger_type,
        event_name: data.general.event_name,
        interval_minutes: data.general.interval_minutes,
        active: data.general.active,
      }

      await createAutomation({
        items: [items],
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["automations"] })
        toast.success("Automation created successfully", {
          position: "top-right",
          duration: 3000,
        })
        setOpen(false)
      }).catch((error) => {
        toast.error(error.message)
      });
    }
  }

  const getFieldsForTab = (tab: Tab): string[] => {
    switch(tab) {
      case Tab.GENERAL:
        return [
          "general.name",
          "general.description",
          "general.event_name",
        ]
      default:
        return []
    }
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button size="small" variant="primary">
          <Plus />
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Create Automation</FocusModal.Title>
          <div className="-my-2 w-full border-l">
            <ProgressTabs
              dir="ltr"
              value={tab}
              className="flex h-full flex-col overflow-hidden"
            >
              <ProgressTabs.List className="justify-start-start flex w-full items-center">
                <ProgressTabs.Trigger value={Tab.GENERAL} status={tabState[Tab.GENERAL]}>
                  General
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </ProgressTabs>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="w-full overflow-y-auto">
          {isAutomationsTriggerLoading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {tab === Tab.GENERAL && <AutomationsGeneralForm form={form} isOpen={open} />}
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
            disabled={isCreateAutomationPending}
            isLoading={isCreateAutomationPending}
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

