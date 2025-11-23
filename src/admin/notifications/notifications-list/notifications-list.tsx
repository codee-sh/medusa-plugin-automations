import { InformationCircleSolid } from "@medusajs/icons"
import { 
  Container,
  Heading,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  Tooltip,
} from "@medusajs/ui"
import { useListNotifications } from "../../../hooks/api/notifications"
import { useState, useMemo } from "react"

type NotificationDTO = {
  id: string
  to: string
  channel: string
  created_at: string
  status: string
  template: string
  trigger_type: string
  resource_id: string
  resource_type: string
  receiver_id: string
  original_notification_id: string
  external_id: string
  provider_id: string
}

export const NotificationsList = ({ entityId, entityType }: { entityId: string, entityType: string }) => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 8,
    pageIndex: 0,
  })

  const limit = 8
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])


  const { data: notificationsData, isLoading: isNotificationsLoading } = useListNotifications({
    resource_id: entityId,
    resource_type: entityType,
    extraKey: [],
    limit: limit,
    offset: offset,
    order: "-created_at",
  })

  const columnHelper = createDataTableColumnHelper<NotificationDTO>()

  const columns = [
    columnHelper.accessor("to", {
      header: "To",
      cell: ({ row }) => {
        const tooltip = `Device (DB) ID: \n ${row?.original?.id}`
        return <>
          <div className="flex items-center gap-2">
            <span>{row?.original?.to}</span>
            <Tooltip content={<div dangerouslySetInnerHTML={{ __html: tooltip }} />} maxWidth={400}>
              <InformationCircleSolid />
            </Tooltip>
          </div>
        </>
      },
    }),
    columnHelper.accessor("channel", {
      header: "Channel",
      cell: ({ row }) => {
        return <span>{row?.original?.channel}</span>
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ row }) => {
        return <span>{row?.original?.created_at ? new Date(row.original.created_at).toLocaleString() : '-'}</span>
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return <span>{row?.original?.status || '-'}</span>
      },
    }),
    columnHelper.accessor("template", {
      header: "Template",
      cell: ({ row }) => {
        return <span>{row?.original?.template || '-'}</span>
      },
    }),
    columnHelper.accessor("trigger_type", {
      header: "Trigger Type",
      cell: ({ row }) => {
        return <span>{row?.original?.trigger_type || '-'}</span>
      },
    })
  ]

  const table = useDataTable({
    columns,
    data: notificationsData?.notifications ?? [],
    isLoading: isNotificationsLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    rowCount: notificationsData?.count ?? 0
  })

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar 
          className="flex items-start justify-between gap-2 md:flex-row md:items-center"
        >
          <Heading level="h2">Notifications - activity</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>      
    </Container>
  )
}
