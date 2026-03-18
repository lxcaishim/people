/** Live Solana mint — override with VITE_TOKEN_MINT / VITE_CA_DISPLAY in `.env` if needed */
const LIVE_TOKEN_MINT =
  "DECr2LsD1pHMQL93xq5oKm41871GtnAGsZvHG2fJjPPL";

const envMint = (import.meta.env.VITE_TOKEN_MINT as string | undefined)?.trim();
const envCa = (import.meta.env.VITE_CA_DISPLAY as string | undefined)?.trim();

/**
 * Chart iframe + “Open on DexScreener” use this mint.
 */
export const TOKEN_MINT = envMint || LIVE_TOKEN_MINT;

/** Pump.fun (footer + steps copy); coin page when live */
export const PUMP_FUN_URL =
  (import.meta.env.VITE_PUMP_FUN_URL as string | undefined)?.trim() ||
  "https://pump.fun";

/** Footer X link — set VITE_FOOTER_X_URL when you have the profile */
export const FOOTER_X_URL =
  (import.meta.env.VITE_FOOTER_X_URL as string | undefined)?.trim() ||
  "https://x.com";

/** Hero “CA: …” + clipboard — matches mint unless VITE_CA_DISPLAY is set */
export const CA_DISPLAY = envCa || envMint || LIVE_TOKEN_MINT;

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
