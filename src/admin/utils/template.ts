import { templateLoaders } from "../automations/actions"

export type TemplateKey = keyof typeof templateLoaders

export async function loadTemplateComponent(
  key: TemplateKey
) {
  const loader = templateLoaders[key]

  if (!loader) {
    throw new Error(`Unknown template key: ${key}`)
  }

  // Zakładamy export default komponentu React
  const module = await loader()
  return module.default
}
