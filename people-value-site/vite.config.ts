import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { shellMarkup } from "./shell.js";

const root = fileURLToPath(new URL(".", import.meta.url));

/** Lets `vite build` run without committing index.html (file is removed after build). */
function tempIndexForBuild() {
  let created = false;
  return {
    name: "temp-index-for-build",
    apply: "build" as const,
    buildStart() {
      const p = join(root, "index.html");
      if (existsSync(p)) return;
      writeFileSync(p, shellMarkup());
      created = true;
    },
    closeBundle() {
      if (!created) return;
      try {
        unlinkSync(join(root, "index.html"));
      } catch {
        /* ignore */
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tempIndexForBuild()],
  publicDir: "public",
});
