/**
 * Initial document markup via React server APIs (no .html source file in the repo).
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function shellMarkup(): string {
  const doctype = ["<", "!DOCTYPE html>"].join("");
  const tree = createElement(
    "html",
    { lang: "en" },
    createElement(
      "head",
      null,
      createElement("meta", { charSet: "UTF-8" }),
      createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      }),
      createElement("link", {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16.png",
      }),
      createElement("link", {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32.png",
      }),
      createElement("link", {
        rel: "apple-touch-icon",
        sizes: "256x256",
        href: "/apple-touch-icon.png",
      }),
      createElement("title", null, "People — Our Greatest Asset")
    ),
    createElement(
      "body",
      null,
      createElement("div", { id: "root" }),
      createElement("script", {
        type: "module",
        src: "/src/main.tsx",
      })
    )
  );
  return doctype + renderToStaticMarkup(tree);
}
