import { InformationCircleSolid } from "@medusajs/icons"
import {
  Container,
  Heading,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  Tooltip,
  Badge,
  Divider,
} from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useListAutomations } from "../../../hooks/api/automations"
import { useState, useMemo } from "react"
import {
  AutomationsEditForm,
  AutomationsCreateForm,
} from "../automations-form"
import { AutomationDeleteButton } from "./components/automation-delete-button"

export const AutomationsList = () => {
  const [pagination, setPagination] =
    useState<DataTablePaginationState>({
      pageSize: 8,
      pageIndex: 0,
    })

  const limit = 8
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const queryClient = useQueryClient()

  const {
    data: automationsTriggersData,
    isLoading: isAutomationsTriggersLoading,
  } = useListAutomations({
    extraKey: [],
    limit: limit,
    offset: offset,
    order: "-created_at",
  })

  const columnHelper = createDataTableColumnHelper<any>()

  const columns = [
    columnHelper.accessor("to", {
      header: "Name and description",
      cell: ({ row }) => {
        const tooltip = `Device (DB) ID: \n ${row?.original?.id}`
        return (
          <>
            <div className="py-2">
              <div className="flex items-center gap-2 mb-2">
                <span>{row?.original?.name}</span>
                <Tooltip
                  content={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: tooltip,
                      }}
                    />
                  }
                  maxWidth={400}
                >
                  <InformationCircleSolid />
                </Tooltip>
              </div>
              <div className="min-w-[180px] whitespace-normal text-xs">
                <span>{row?.original?.description}</span>
              </div>
            </div>
          </>
        )
      },
    }),
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
    columnHelper.accessor("last_run_at", {
      header: "Last Run At",
      cell: ({ row }) => {
        const lastRunAtAll = row?.original?.states
          ?.map((state: any) => state.last_triggered_at)
          .sort(
            (a: any, b: any) =>
              new Date(b).getTime() - new Date(a).getTime()
          )
        return (
          <span>
            {lastRunAtAll.length > 0
              ? new Date(lastRunAtAll[0]).toLocaleString()
              : "-"}
          </span>
        )
      },
    }),
    columnHelper.accessor("active", {
      header: "Active",
      cell: ({ row }) => {
        const color = row?.original?.active
          ? "green"
          : "red"
        const text = row?.original?.active ? "Yes" : "No"

        return (
          <Badge size="small" color={color}>
            {text}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ row }) => {
        return (
          <span>
            {row?.original?.created_at
              ? new Date(
                  row.original.created_at
                ).toLocaleString()
              : "-"}
          </span>
        )
      },
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated At",
      cell: ({ row }) => {
        return (
          <span>
            {row?.original?.updated_at
              ? new Date(
                  row.original.updated_at
                ).toLocaleString()
              : "-"}
          </span>
        )
      },
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <AutomationsEditForm id={row?.original?.id} />
            <AutomationDeleteButton
              id={row?.original?.id}
            />
          </div>
        )
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
    rowCount: automationsTriggersData?.count ?? 0,
  })

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading level="h2">List of automations</Heading>
          <AutomationsCreateForm />
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}
