import { ComponentType, ReactNode } from "react"

export interface Widgets<TData> {
  before: Array<ComponentType<{ data: TData }>>
  after: Array<ComponentType<{ data: TData }>>
}

export interface PageProps<TData> {
  children: ReactNode
  data?: TData
  showJSON?: boolean
  showMetadata?: boolean
  isLoading?: boolean
  hasOutlet?: boolean
  widgets: Widgets<TData>
}
