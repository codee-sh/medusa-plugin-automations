import { InformationCircleSolid } from "@medusajs/icons"
import { 
  Container,
  Heading,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  Tooltip,
  Badge
} from "@medusajs/ui"
import { useListAutomationsTriggers } from "../../../hooks/api/automations-triggers"
import { useState, useMemo } from "react"
import { AutomationsTriggerFormEdit } from "../automations-trigger-form/edit"
// import { AutomationsTriggerForm } from "../automations-trigger-form/automations-trigger-form"

export const AutomationsTriggersList = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 8,
    pageIndex: 0,
  })

  const limit = 8
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data: automationsTriggersData, isLoading: isAutomationsTriggersLoading } = useListAutomationsTriggers({
    extraKey: [],
    limit: limit,
    offset: offset,
    order: "-created_at",  
  })

  const columnHelper = createDataTableColumnHelper<any>()

  const columns = [
    columnHelper.accessor("to", {
      header: "Name",
      cell: ({ row }) => {
        const tooltip = `Device (DB) ID: \n ${row?.original?.id}`
        return <>
          <div className="flex items-center gap-2">
            <span>{row?.original?.name}</span>
            <Tooltip content={<div dangerouslySetInnerHTML={{ __html: tooltip }} />} maxWidth={400}>
              <InformationCircleSolid />
            </Tooltip>
          </div>
        </>
      },
    }),
    // columnHelper.accessor("description", {
    //   header: "Description",
    //   cell: ({ row }) => {
    //     return <span>{row?.original?.description}</span>
    //   },
    // }),
    columnHelper.accessor("trigger_type", {
      header: "Trigger Type",
      cell: ({ row }) => {
        return <span>{row?.original?.trigger_type}</span>
      },
    }),
    columnHelper.accessor("event_name", {
      header: "Event Name",
      cell: ({ row }) => {
        return <span>{row?.original?.event_name}</span>
      },
    }),
    columnHelper.accessor("interval_minutes", {
      header: "Interval Minutes",
      cell: ({ row }) => {
        return <span>{row?.original?.interval_minutes}</span>
      },
    }),
    columnHelper.accessor("last_run_at", {
      header: "Last Run At",
      cell: ({ row }) => {
        return <span>{row?.original?.last_run_at ? new Date(row.original.last_run_at).toLocaleString() : '-'}</span>
      },
    }),
    columnHelper.accessor("active", {
      header: "Active",
      cell: ({ row }) => {
        return <span>{row?.original?.active ? 'Yes' : 'No'}</span>
      },
    }),
    columnHelper.accessor("channels", {
      header: "Channels",
      cell: ({ row }) => {
        const channels = row.original.channels ? row.original.channels : []
        return channels.length > 0 ? (channels.map((channel: string, index: number) => {
          return (
            <Badge key={index} size="2xsmall" className="text-xs">
              {channel}
            </Badge>
          )
        })) : <span className="text-ui-fg-muted">No channels</span>
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ row }) => {
        return <span>{row?.original?.created_at ? new Date(row.original.created_at).toLocaleString() : '-'}</span>
      },
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated At",
      cell: ({ row }) => {
        return <span>{row?.original?.updated_at ? new Date(row.original.updated_at).toLocaleString() : '-'}</span>
      },
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return <>
          <AutomationsTriggerFormEdit id={row?.original?.id} />
        </>
      },
    }),
  ]

  const table = useDataTable({
    columns,
    data: automationsTriggersData?.triggers ?? [],
    isLoading: isAutomationsTriggersLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    rowCount: automationsTriggersData?.count ?? 0
  })

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar 
          className="flex items-start justify-between gap-2 md:flex-row md:items-center"
        >
          <Heading level="h2">Automations - list</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>      
    </Container>
  )
}
