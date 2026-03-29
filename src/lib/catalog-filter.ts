import { PHONES } from "./phones.js";

export type CatalogPhone = (typeof PHONES)[number];

const FEATURE_PREDICATES: Record<string, (p: CatalogPhone) => boolean> = {
  "5g": (p) => p.is5G === true,
  ram8: (p) => {
    const n = parseInt(String(p.specs.ram).replace(/\D/g, ""), 10);
    return n >= 8;
  },
  storage256: (p) => {
    const s = `${p.storage || ""}`;
    return /256|512|1tb|1\s*tb/i.test(s);
  },
  slim: (p) => p.thickness < 8,
  "120hz": (p) => p.refreshRate >= 120,
  ai: (p) => p.year >= 2023 && p.performanceScore >= 8.2,
};

/** Shared rule for catalog grid and on-device AI picks */
export function phoneMatchesFeatureKey(
  phone: CatalogPhone,
  key: string | null,
): boolean {
  if (!key) return true;
  const pred = FEATURE_PREDICATES[key];
  return pred ? pred(phone) : true;
}

export type PriorityKey = "gaming" | "camera" | "daily" | "battery";

const PRIORITY_WEIGHTS: Record<
  PriorityKey,
  { perf: number; camera: number; battery: number }
> = {
  gaming: { perf: 0.52, camera: 0.22, battery: 0.26 },
  camera: { perf: 0.22, camera: 0.52, battery: 0.26 },
  daily: { perf: 0.35, camera: 0.35, battery: 0.3 },
  battery: { perf: 0.28, camera: 0.27, battery: 0.45 },
};

export function combinePriorityWeights(
  keys: readonly string[],
): { perf: number; camera: number; battery: number } {
  const valid = keys.filter((k): k is PriorityKey => k in PRIORITY_WEIGHTS);
  if (valid.length === 0) {
    return { perf: 1 / 3, camera: 1 / 3, battery: 1 / 3 };
  }
  let acc = { perf: 0, camera: 0, battery: 0 };
  for (const k of valid) {
    const w = PRIORITY_WEIGHTS[k];
    acc = {
      perf: acc.perf + w.perf,
      camera: acc.camera + w.camera,
      battery: acc.battery + w.battery,
    };
  }
  const sum = acc.perf + acc.camera + acc.battery;
  return {
    perf: acc.perf / sum,
    camera: acc.camera / sum,
    battery: acc.battery / sum,
  };
}

export function weightedCatalogScore(
  phone: CatalogPhone,
  w: { perf: number; camera: number; battery: number },
): number {
  return (
    phone.performanceScore * w.perf +
    phone.cameraScore * w.camera +
    phone.batteryScore * w.battery
  );
}

export type CatalogFilterOpts = {
  budgetMin: number;
  budgetMax: number;
  selectedBrand: string | null;
  /** Narrow catalog by name (search) */
  searchQuery: string;
  activeFeatureKey: string | null;
  /** Selected priority presets — empty means equal weight on perf/camera/battery */
  priorityKeys: readonly string[];
};

export function filterCatalogPhones(opts: CatalogFilterOpts): CatalogPhone[] {
  let list = PHONES.filter(
    (p) => p.price >= opts.budgetMin && p.price <= opts.budgetMax,
  );

  if (opts.selectedBrand) {
    list = list.filter((p) => p.brand === opts.selectedBrand);
  }

  const q = opts.searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (opts.activeFeatureKey) {
    list = list.filter((p) =>
      phoneMatchesFeatureKey(p, opts.activeFeatureKey),
    );
  }

  const w = combinePriorityWeights(opts.priorityKeys);
  return [...list].sort((a, b) => {
    const diff =
      weightedCatalogScore(b, w) - weightedCatalogScore(a, w);
    if (Math.abs(diff) > 1e-6) return diff;
    return b.scores.overall - a.scores.overall;
  });
}

export function filterByNameQuery(
  phones: CatalogPhone[],
  needle: string,
  limit = 8,
): CatalogPhone[] {
  const q = needle.trim().toLowerCase();
  if (!q) return phones.slice(0, limit);
  return phones
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, limit);
}
