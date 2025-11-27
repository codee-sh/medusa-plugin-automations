import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ListBullet } from "@medusajs/icons";
import { SingleColumnPage } from "../../../components/layout/pages";
import { AutomationsTriggersList } from "../../../automations/automations-triggers-list";

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <AutomationsTriggersList />
    </SingleColumnPage>
  );
};

export const config = defineRouteConfig({
  label: "Automations",
  icon: ListBullet,
});

export default ListPage;
