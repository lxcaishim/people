/**
 * "Our people" counter: one dot per unique device.
 * Uses Supabase visitor database when configured; falls back to CountAPI.
 */

import { supabase } from "./supabase";

const REG_KEY = "people_registered_v3";
const DEVICE_ID_KEY = "people_device_id_v1";
const LAST_COUNT_KEY = "people_last_global_count";

/* CountAPI fallback when Supabase is not configured */
const COUNT_NS = "peop1_lxcaishim";
const COUNT_KEY = "uniq_devices_v3";
const countApiHit = () =>
  fetch(`https://api.countapi.xyz/hit/${COUNT_NS}/${COUNT_KEY}`).then((r) =>
    r.json()
  );
const countApiGet = () =>
  fetch(`https://api.countapi.xyz/get/${COUNT_NS}/${COUNT_KEY}`).then((r) =>
    r.json()
  );

function parseCountApi(j: { value?: number }): number {
  const v = Number(j.value);
  return Number.isFinite(v) && v >= 1 ? v : 1;
}

function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return `dev_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

let registerInflight: Promise<number> | null = null;

function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

async function fetchFromSupabase(): Promise<number> {
  if (!supabase) return 0;
  const deviceId = getOrCreateDeviceId();

  const { error } = await supabase.from("visitors").upsert(
    { device_id: deviceId },
    { onConflict: "device_id", ignoreDuplicates: true }
  );
  if (error) throw error;

  const { count, error: countError } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });
  if (countError) throw countError;

  return Math.max(1, count ?? 1);
}

async function fetchFromCountApi(): Promise<number> {
  let alreadyRegistered = false;
  try {
    alreadyRegistered = !!localStorage.getItem(REG_KEY);
  } catch {
    alreadyRegistered = false;
  }

  if (alreadyRegistered) {
    const j = (await countApiGet()) as { value?: number };
    return parseCountApi(j);
  }

  if (!registerInflight) {
    registerInflight = (async () => {
      try {
        const j = (await countApiHit()) as { value?: number };
        const c = parseCountApi(j);
        try {
          localStorage.setItem(REG_KEY, "1");
        } catch {
          /* ignore */
        }
        return c;
      } finally {
        registerInflight = null;
      }
    })();
  }
  return await registerInflight;
}

export async function fetchPeopleDotCount(): Promise<number> {
  if (typeof window === "undefined") return 1;

  if (isLocalDev() && supabase) {
    try {
      const count = await fetchFromSupabase();
      return count;
    } catch {
      try {
        return Math.max(
          1,
          Number(localStorage.getItem(LAST_COUNT_KEY)) || 1
        );
      } catch {
        return 1;
      }
    }
  }

  if (isLocalDev()) {
    try {
      const j = (await countApiGet()) as { value?: number };
      return parseCountApi(j);
    } catch {
      try {
        return Math.max(
          1,
          Number(localStorage.getItem(LAST_COUNT_KEY)) || 1
        );
      } catch {
        return 1;
      }
    }
  }

  try {
    const count = supabase ? await fetchFromSupabase() : await fetchFromCountApi();
    try {
      localStorage.setItem(LAST_COUNT_KEY, String(count));
    } catch {
      /* ignore */
    }
    return count;
  } catch {
    try {
      const last = localStorage.getItem(LAST_COUNT_KEY);
      return Math.max(1, Number(last) || 1);
    } catch {
      return 1;
    }
  }
}
