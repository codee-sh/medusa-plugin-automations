import { useState } from "react"; // TODO: Remove this
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ListBullet } from "@medusajs/icons";
import { Container, Heading, Select, Text } from "@medusajs/ui";
import { SingleColumnPage } from "../../../components/layout/pages";
import { NotificationsFullList } from "../../../notifications/notifications-full-list";

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <NotificationsFullList />
    </SingleColumnPage>
  );
};

export const config = defineRouteConfig({
  label: "List",
  icon: ListBullet,
});

export default ListPage;
