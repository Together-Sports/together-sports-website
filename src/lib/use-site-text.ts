import { useEditableContent } from "@/lib/editable-content";
import { resolveText } from "@/lib/text-registry";

// Returns t(key) — the admin's Page Text override for the key, or the
// built-in default from the text registry.
export const useSiteText = () => {
  const { siteText } = useEditableContent();
  const overrides = siteText?.textOverrides;

  return (key: string) => resolveText(overrides, key);
};
