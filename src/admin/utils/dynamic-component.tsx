import { useState, useEffect } from "react";
import { ActionConfigComponentProps } from "../../modules/mpn-automation/types/action-handler";
import { loadTemplateComponent } from "./template";

export default function LoadActionComponent({
  actionType,
  configComponentPath,
  form,
  name,
  errors,
  fields,
}: {
  actionType: string;
  configComponentPath?: string;
  form: any;
  name: any;
  errors?: Record<string, string>;
  fields?: any;
}) {
  const [Component, setComponent] =
    useState<React.ComponentType<ActionConfigComponentProps> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!actionType || !configComponentPath) {
      setComponent(null);
      return;
    }

    setLoading(true);
    setError(null);

    loadTemplateComponent(configComponentPath as any)
      .then((module) => {
        const Component = module;
        console.log("Component", Component);
        if (Component) {
          setComponent(() => Component as any);
        } else {
          setError(`Component not found in ${configComponentPath}`);
        }
      })
      .catch((err) => {
        console.error(
          `Failed to load component from ${configComponentPath}:`,
          err
        );
        setError(`Failed to load component: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actionType, configComponentPath]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">Loading configuration...</div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  if (!Component) {
    return null;
  }

  return <Component form={form} name={name} errors={errors} fields={fields} />;
}
