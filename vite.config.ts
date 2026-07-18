import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8081,
    strictPort: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Chunk splitting only applies to the client bundle — the SSR
        // (prerender) build must stay a single module.
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (
            id.includes("\\node_modules\\react\\") ||
            id.includes("/node_modules/react/") ||
            id.includes("\\node_modules\\react-dom\\") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("\\node_modules\\scheduler\\") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-core";
          }

          if (id.includes("@supabase/supabase-js")) {
            return "supabase";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("@radix-ui/")) {
            return "radix";
          }

          if (id.includes("@tanstack/react-query")) {
            return "query";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
            return "forms";
          }

          return "vendor";
        },
      },
    },
  },
}));

