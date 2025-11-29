import { Button, FocusModal, ProgressTabs, ProgressStatus } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { FieldValues, useForm, FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateAutomation } from "../../../../hooks/api/automations"
import { AutomationsCreateGeneralForm } from "../automations-create-general-form"
import { AutomationFormValues } from "../types"
import { automationFormSchema } from "../constants"
import { ChannelType } from "../../types"

enum Tab {
  GENERAL = "general",
  RULES = "rules",
  ACTIONS = "actions",
}

type TabState = Record<Tab, ProgressStatus>

export function AutomationsCreateForm() {
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

  const { isPending: isCreateAutomationPending } = useCreateAutomation()

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

  function handleSubmit(data: FieldValues) {
    console.log(data)
  }

  const handleError = async (errors: FieldErrors) => {
    console.log("Validation errors:", errors)

    const fieldsToValidate = getFieldsForTab(Tab.GENERAL)
    console.log(fieldsToValidate)

    // Waliduj tylko pola z aktualnego taba
    const valid = await form.trigger(fieldsToValidate as any)  
    console.log(valid)
    if (!valid) {
      console.log("Please complete all required fields")
      return
    }
  }  

  // Funkcja pomocnicza do określenia pól dla każdego taba
  const getFieldsForTab = (tab: Tab): (keyof FieldValues | `general.${string}` | `rules.${string}` | `actions.${string}`)[] => {
    switch(tab) {
      case Tab.GENERAL:
        // Waliduj wszystkie pola z grupy general
        return [
          "general.name",
          "general.description", 
          // "general.trigger_type",
          "general.event_name",
          // Dodaj wszystkie wymagane pola z general
        ]
      case Tab.RULES:
        return [
          "rules.items",
          // lub konkretne pola jeśli potrzebne
          // "rules.name",
        ]
      case Tab.ACTIONS:
        return [
          "actions.items",
          // lub konkretne pola jeśli potrzebne
          // "actions.name",
        ]
      default:
        return []
    }
  }

  const handleTabChange = async (newTab: string) => {
    // Określ pola do walidacji dla aktualnego taba
    const fieldsToValidate = getFieldsForTab(tab)
    
    // Waliduj tylko pola z aktualnego taba
    const valid = await form.trigger(fieldsToValidate as any)
    
    if (!valid) {
      return
    }
    
    // Jeśli walidacja przeszła, zaktualizuj stan i przejdź do kolejnego taba
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
          <Plus />
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="-my-2 w-full border-l">
          <ProgressTabs
            dir="ltr"
            value={tab}
            onClick={() => handleTabChange(tab)}
            className="flex h-full flex-col overflow-hidden"
          >       

            <ProgressTabs.List className="justify-start-start flex w-full items-center">
              <ProgressTabs.Trigger value="general" status={tabState[Tab.GENERAL]}>General</ProgressTabs.Trigger>
              <ProgressTabs.Trigger value="rules" status={tabState[Tab.RULES]}>Rules</ProgressTabs.Trigger>
              <ProgressTabs.Trigger value="actions" status={tabState[Tab.ACTIONS]}>Actions</ProgressTabs.Trigger>
            </ProgressTabs.List>
          </ProgressTabs>
          </div>
        </FocusModal.Header>
          <FocusModal.Body className="w-full overflow-y-auto">
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)}>
              <AutomationsCreateGeneralForm form={form} />
            </form>
          </FocusModal.Body>
          <FocusModal.Footer>
            <Button type="submit" onClick={form.handleSubmit(handleSubmit, handleError)}>{buttonText}</Button>
          </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}