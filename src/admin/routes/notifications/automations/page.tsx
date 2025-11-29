import { defineRouteConfig } from "@medusajs/admin-sdk";
import { SingleColumnPage } from "../../../components/layout/pages";
import { AutomationsList } from "../../../automations/automations-list";

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <AutomationsList />
    </SingleColumnPage>
  );
};

export const config = defineRouteConfig({
  label: "Automations"
});

export default ListPage;
