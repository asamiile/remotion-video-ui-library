import type { CompositionTextLocal } from "./composition-text-local";
import type { MapLocationPoint } from "../Map/Map/mini-map.schema";
import compositionTextExample from "../../config/local/composition-text.example.json";
import {
  __COMPOSITION_TEXT_INLINED__,
  __LOCATION_KEYS_INLINED__,
} from "./inlined-composition-text";

const ENV_KEY = "REMOTION_COMPOSITION_TEXT_LOCAL_JSON" as const;
const LOCATION_KEYS_ENV = "REMOTION_LOCATION_COMPOSITION_KEYS_JSON" as const;

function isNonEmptyCompositionText(c: CompositionTextLocal): boolean {
  return Object.keys(c).some((key) => {
    const v = c[key as keyof CompositionTextLocal];
    if (v === undefined || v === null) {
      return false;
    }
    if (typeof v === "object" && !Array.isArray(v)) {
      return Object.keys(v as object).length > 0;
    }
    return true;
  });
}

/**
 * Studio / bundle: the merged result injected by the webpack loader (preferred).
 * Compat: a JSON string from DefinePlugin.
 */
export function getCompositionTextFromEnv(): CompositionTextLocal {
  if (isNonEmptyCompositionText(__COMPOSITION_TEXT_INLINED__)) {
    return __COMPOSITION_TEXT_INLINED__;
  }
  try {
    const raw =
      typeof process !== "undefined" &&
      process.env &&
      typeof process.env[ENV_KEY] === "string"
        ? process.env[ENV_KEY]
        : undefined;
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as CompositionTextLocal;
  } catch {
    return {};
  }
}

/**
 * 1) The inline or DefinePlugin merge result
 * 2) Falls back to the imported example.json when empty
 */
export function getEffectiveCompositionText(): CompositionTextLocal {
  const fromEnv = getCompositionTextFromEnv();
  if (isNonEmptyCompositionText(fromEnv)) {
    return fromEnv;
  }
  return compositionTextExample as CompositionTextLocal;
}

export function shallowMergePatternRecord<
  T extends Record<string, Record<string, unknown>>,
>(base: T, patch: Partial<Record<keyof T, Partial<T[keyof T]>>> | undefined): T {
  if (!patch) {
    return base;
  }
  const out = { ...base };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const p = patch[key];
    if (p) {
      // Merge with existing pattern or add new pattern
      out[key] = out[key] ? ({ ...out[key], ...p } as T[keyof T]) : (p as T[keyof T]);
    }
  }
  return out;
}

/** location keys, in priority order: inline array -> DefinePlugin -> effective */
export function getLocationCompositionKeys(): string[] {
  if (
    Array.isArray(__LOCATION_KEYS_INLINED__) &&
    __LOCATION_KEYS_INLINED__.length > 0
  ) {
    return __LOCATION_KEYS_INLINED__;
  }
  try {
    const raw =
      typeof process !== "undefined" &&
      process.env &&
      typeof process.env[LOCATION_KEYS_ENV] === "string"
        ? process.env[LOCATION_KEYS_ENV]
        : undefined;
    if (raw) {
      return JSON.parse(raw) as string[];
    }
  } catch {
    /* fall through */
  }
  return Object.keys(getEffectiveCompositionText().location ?? {});
}

export function buildLocationConfigsFromCompositionKeys(
  text: CompositionTextLocal,
  keys: string[],
): { id: string; locationName: string }[] {
  const block = text.location ?? {};
  return keys.map((id) => ({
    id,
    locationName: block[id]?.locationName ?? id,
  }));
}

/** Only locations with both latitude and longitude set (for MiniMap) */
export function buildMapLocationPointsFromCompositionKeys(
  text: CompositionTextLocal,
  keys: string[],
): MapLocationPoint[] {
  const mapBlock = text.mapLocationPoints ?? {};
  const locBlock = text.location ?? {};
  const out: MapLocationPoint[] = [];
  for (const id of keys) {
    const row = mapBlock[id];
    if (
      !row ||
      typeof row.latitude !== "number" ||
      typeof row.longitude !== "number"
    ) {
      continue;
    }
    out.push({
      id,
      name: row.name ?? locBlock[id]?.locationName ?? id,
      latitude: row.latitude,
      longitude: row.longitude,
      zoom: row.zoom,
      pitch: row.pitch,
      bearing: row.bearing,
    });
  }
  return out;
}
