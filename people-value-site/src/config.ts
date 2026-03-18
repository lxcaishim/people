/**
 * When your token is live, set the Solana mint address:
 * - Create `.env` with VITE_TOKEN_MINT=YourAddressHere and restart dev server, or
 * - Replace the fallback string below (optional).
 *
 * Chart + “Open on DexScreener” use this automatically.
 */
export const TOKEN_MINT =
  (import.meta.env.VITE_TOKEN_MINT as string | undefined)?.trim() || "";

/** Pump.fun (footer + steps copy); coin page when live */
export const PUMP_FUN_URL =
  (import.meta.env.VITE_PUMP_FUN_URL as string | undefined)?.trim() ||
  "https://pump.fun";

/** Footer X link — set VITE_FOOTER_X_URL when you have the profile */
export const FOOTER_X_URL =
  (import.meta.env.VITE_FOOTER_X_URL as string | undefined)?.trim() ||
  "https://x.com";

/**
 * Hero shows "CA: {value}". Until launch use TBD.
 * After launch set e.g. VITE_CA_DISPLAY=YourFullMintAddress (or short label).
 */
export const CA_DISPLAY =
  (import.meta.env.VITE_CA_DISPLAY as string | undefined)?.trim() || "TBD";

/** Official Pump.fun logomark (green/white capsule) */
export const PUMP_LOGOMARK_URL = "https://pump.fun/pump-logomark.svg";

export function dexScreenerChartUrl(mint: string): string {
  const m = mint.trim();
  if (!m) return "https://dexscreener.com/solana";
  return `https://dexscreener.com/solana/${encodeURIComponent(m)}`;
}

/** Iframe: Solana explorer when no mint; your pair when VITE_TOKEN_MINT is set */
export function dexScreenerIframeSrc(mint: string): string {
  const m = mint.trim();
  const path = m
    ? `https://dexscreener.com/solana/${encodeURIComponent(m)}`
    : "https://dexscreener.com/solana";
  return `${path}?embed=1&theme=dark&trades=0&info=0`;
}
