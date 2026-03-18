/**
 * Dev server: document shell comes from shell.ts (React APIs), not from a static .html file.
 */
import express from "express";
import { createServer as createViteServer } from "vite";
import { shellMarkup } from "./shell.js";

function looksLikeAsset(pathname: string): boolean {
  if (pathname.startsWith("/src/")) return true;
  if (pathname.startsWith("/@")) return true;
  if (pathname.startsWith("/node_modules/")) return true;
  if (pathname.startsWith("/assets/")) return true;
  const last = pathname.split("/").pop() ?? "";
  if (!last.includes(".")) return false;
  const ext = last.split(".").pop()?.toLowerCase() ?? "";
  return !["tsx", "ts", "jsx", "js", "vue", "svelte"].includes(ext);
}

const PEOPLE_COUNT_NS = "peop1_lxcaishim";
const PEOPLE_COUNT_KEY = "unique_browsers_v1";

async function main() {
  const app = express();

  app.get("/api/people-visit", async (req, res) => {
    const mode = req.query.mode === "get" ? "get" : "hit";
    const url =
      mode === "get"
        ? `https://api.countapi.xyz/get/${PEOPLE_COUNT_NS}/${PEOPLE_COUNT_KEY}`
        : `https://api.countapi.xyz/hit/${PEOPLE_COUNT_NS}/${PEOPLE_COUNT_KEY}`;
    try {
      const r = await fetch(url);
      const j = (await r.json()) as { value?: number };
      const v = Number(j.value);
      const count = Number.isFinite(v) && v >= 1 ? v : 1;
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json({ count });
    } catch {
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json({ count: 1 });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: process.cwd(),
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    const url = req.originalUrl ?? "/";
    const pathname = url.split("?")[0] ?? "/";
    if (looksLikeAsset(pathname)) {
      next();
      return;
    }
    const accept = req.headers.accept ?? "";
    if (!accept.includes("text/html")) {
      next();
      return;
    }
    try {
      let html = shellMarkup();
      html = await vite.transformIndexHtml(url, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  const port = Number(process.env.PORT) || 5173;
  app.listen(port, () => {
    console.log(`  Local:   http://localhost:${port}/`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
