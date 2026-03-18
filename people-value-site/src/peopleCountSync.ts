/**
 * Global "Our people" counter: one increment per browser/device (localStorage),
 * same total on localhost and production. Uses CountAPI directly from the
 * browser so Vercel does not need a working /api route.
 */

const NS = "peop1_lxcaishim";
const KEY = "uniq_devices_v3";
const REG_KEY = "people_registered_v3";
const LAST_COUNT_KEY = "people_last_global_count";

const countApiHit = () =>
  fetch(`https://api.countapi.xyz/hit/${NS}/${KEY}`).then((r) => r.json());
const countApiGet = () =>
  fetch(`https://api.countapi.xyz/get/${NS}/${KEY}`).then((r) => r.json());

function parseValue(j: { value?: number }): number {
  const v = Number(j.value);
  return Number.isFinite(v) && v >= 1 ? v : 1;
}

/** Single in-flight registration so React Strict Mode does not double-hit. */
let registerInflight: Promise<number> | null = null;

function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

export async function fetchPeopleDotCount(): Promise<number> {
  if (typeof window === "undefined") return 1;

  /* Dev: never increment the global counter — same total as production. */
  if (isLocalDev()) {
    try {
      const j = (await countApiGet()) as { value?: number };
      return parseValue(j);
    } catch {
      try {
        return Math.max(1, Number(localStorage.getItem(LAST_COUNT_KEY)) || 1);
      } catch {
        return 1;
      }
    }
  }

  let alreadyRegistered = false;
  try {
    alreadyRegistered = !!localStorage.getItem(REG_KEY);
  } catch {
    alreadyRegistered = false;
  }

  try {
    if (alreadyRegistered) {
      const j = (await countApiGet()) as { value?: number };
      const c = parseValue(j);
      try {
        localStorage.setItem(LAST_COUNT_KEY, String(c));
      } catch {
        /* ignore */
      }
      return c;
    }

    if (!registerInflight) {
      registerInflight = (async () => {
        try {
          const j = (await countApiHit()) as { value?: number };
          const c = parseValue(j);
          try {
            localStorage.setItem(REG_KEY, "1");
            localStorage.setItem(LAST_COUNT_KEY, String(c));
          } catch {
            /* private mode: may recount on next visit */
          }
          return c;
        } finally {
          registerInflight = null;
        }
      })();
    }
    return await registerInflight;
  } catch {
    try {
      const last = localStorage.getItem(LAST_COUNT_KEY);
      return Math.max(1, Number(last) || 1);
    } catch {
      return 1;
    }
  }
}
