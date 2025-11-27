export type InventoryLevelUpdatedTemplateDataType = {
  inventory_level: {
    id: string;
    location_id: string;
    stocked_quantity: string;
    reserved_quantity: string;
    available_quantity: string;
    incoming_quantity: string;
  };
  inventory_item: {
    id: string;
    title: string;
    sku: string;
    origin_country: string;
  };
  location: {
    id: string;
    name: string;
  };
};
