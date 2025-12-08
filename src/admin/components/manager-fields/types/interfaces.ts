import { FieldConfig } from "./types"

export interface DeclarativeFieldManagerProps {
  fields: FieldConfig[]
  name: string
  form: any
  errors?: any
}
