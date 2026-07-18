import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  EditableContentProvider,
  resolveLiveContent,
} from "@/lib/editable-content";
import {
  hydrateEditableContentState,
  parseEditableContentImport,
  type EditableContentState,
} from "@/lib/editable-content-format";
import editableContentSeed from "@/data/editableContentSeed";
import { SiteRoutes } from "./App";
import "./index.css";

// Renders one route to static HTML for scripts/prerender.mjs. The output is
// SEO markup + the visitor's first paint; the client bundle re-renders with
// live content once it boots, so this doesn't need to hydrate-match.
export const render = (url: string, content: EditableContentState): string =>
  renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <EditableContentProvider initialContent={content}>
        <TooltipProvider>
          <StaticRouter location={url}>
            <SiteRoutes />
          </StaticRouter>
        </TooltipProvider>
      </EditableContentProvider>
    </QueryClientProvider>
  );

export const getDefaultContent = (): EditableContentState =>
  hydrateEditableContentState(editableContentSeed);

export { parseEditableContentImport, resolveLiveContent };
export { getMetaForPath, buildStructuredData, SITE_NAME } from "@/lib/seo-meta";
export type { EditableContentState };
