import { Button, FocusModal, ProgressTabs, ProgressStatus } from "@medusajs/ui";
import { Plus } from "@medusajs/icons";
import { useState, useEffect, useMemo } from "react";
import { FieldValues, useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateAutomation } from "../../../../hooks/api/automations";
import { useAvailableActions } from "../../../../hooks/api/available-actions";
import { AutomationsGeneralForm } from "../automations-general-form";
import { AutomationFormValues, Tab, TabState } from "../types";
import { createAutomationFormSchema } from "../utils/automation-form-schema";

export function AutomationsCreateForm() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(Tab.GENERAL);
  const [tabState, setTabState] = useState<TabState>({
    [Tab.GENERAL]: "in-progress",
    [Tab.RULES]: "not-started",
    [Tab.ACTIONS]: "not-started",
  });
  const [buttonText, setButtonText] = useState<string>("");

  useEffect(() => {
    if (Tab.GENERAL === tab) {
      setButtonText("Save automation");
    } else if (Tab.RULES === tab) {
      setButtonText("Save rules");
    } else if (Tab.ACTIONS === tab) {
      setButtonText("Save actions");
    }
  }, [tab]);

  const queryClient = useQueryClient();

  const {
    mutateAsync: createAutomation,
    isPending: isCreateAutomationPending,
  } = useCreateAutomation();

  const { data: availableActionsData } = useAvailableActions({
    enabled: open,
  });

  // Create dynamic schema with superRefine based on availableActions
  const automationFormSchema = useMemo(() => {
    return createAutomationFormSchema(availableActionsData?.actions);
  }, [availableActionsData?.actions]);

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
    },
  });

  async function handleSubmit(data: FieldValues) {
    if (Tab.GENERAL === tab) {
      const items = {
        name: data.general.name,
        description: data.general.description,
        trigger_type: data.general.trigger_type,
        event_name: data.general.event_name,
        interval_minutes: data.general.interval_minutes,
        active: data.general.active
      };

      await createAutomation({
        items: [items],
      });

      queryClient.invalidateQueries({ queryKey: ["automations"] });
      setOpen(false);
    }
  }

  const handleError = async (errors: FieldErrors) => {
    console.log("Validation errors:", errors);

    const fieldsToValidate = getFieldsForTab(Tab.GENERAL);
    console.log(fieldsToValidate);

    // Waliduj tylko pola z aktualnego taba
    const valid = await form.trigger(fieldsToValidate as any);
    console.log(valid);
    if (!valid) {
      console.log("Please complete all required fields");
      return;
    }
  };

  // Funkcja pomocnicza do określenia pól dla każdego taba
  const getFieldsForTab = (
    tab: Tab
  ): (
    | keyof FieldValues
    | `general.${string}`
    | `rules.${string}`
    | `actions.${string}`
  )[] => {
    switch (tab) {
      case Tab.GENERAL:
        // Waliduj wszystkie pola z grupy general
        return [
          "general.name",
          "general.description",
          // "general.trigger_type",
          "general.event_name",
          // Dodaj wszystkie wymagane pola z general
        ];
      case Tab.RULES:
        return [
          "rules.items",
        ];
      case Tab.ACTIONS:
        return [
          "actions.items",
        ];
      default:
        return [];
    }
  };

  const handleTabChange = async (newTab: string) => {
    // Określ pola do walidacji dla aktualnego taba
    const fieldsToValidate = getFieldsForTab(tab);

    // Waliduj tylko pola z aktualnego taba
    const valid = await form.trigger(fieldsToValidate as any);

    if (!valid) {
      return;
    }

    // Jeśli walidacja przeszła, zaktualizuj stan i przejdź do kolejnego taba
    setTabState((prev) => ({
      ...prev,
      [tab]: "completed",
      [newTab]: "in-progress",
    }));

    setTab(newTab as Tab);
  };

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
                <ProgressTabs.Trigger
                  value="general"
                  status={tabState[Tab.GENERAL]}
                  onClick={() => handleTabChange(Tab.GENERAL)}
                >
                  General
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  value="rules"
                  status={tabState[Tab.RULES]}
                  onClick={() => handleTabChange(Tab.RULES)}
                >
                  Rules
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  value="actions"
                  status={tabState[Tab.ACTIONS]}
                  onClick={() => handleTabChange(Tab.ACTIONS)}
                >
                  Actions
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </ProgressTabs>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="w-full overflow-y-auto">
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)}>
            <AutomationsGeneralForm form={form} isOpen={open} />
          </form>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit, handleError)}
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
}
