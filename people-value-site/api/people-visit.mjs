/**
 * Vercel serverless: shared visitor count for "Our people" dots.
 * Proxies CountAPI (server-side so no CORS issues).
 */
const NS = "peop1_lxcaishim";
const KEY = "unique_browsers_v1";

export default async function handler(req, res) {
  const mode = req.query?.mode === "get" ? "get" : "hit";
  const url =
    mode === "get"
      ? `https://api.countapi.xyz/get/${NS}/${KEY}`
      : `https://api.countapi.xyz/hit/${NS}/${KEY}`;
  try {
    const r = await fetch(url);
    const j = await r.json();
    const v = Number(j.value);
    const count = Number.isFinite(v) && v >= 1 ? v : 1;
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ count });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ count: 1 });
  }
}
