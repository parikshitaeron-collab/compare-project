import { PHONES } from "./phones.js";
import {
  combinePriorityWeights,
  phoneMatchesFeatureKey,
  weightedCatalogScore,
  type CatalogPhone,
} from "./catalog-filter";

export type AiRankedPhone = {
  phone: CatalogPhone;
  aiScore: number;
};

/**
 * On-device “AI” pick: top N phones for current budget, optional brand,
 * and priority weights (gaming→perf, camera→camera, battery→battery, daily→balanced).
 */
export function getAiTopPhones(opts: {
  budgetMin: number;
  budgetMax: number;
  selectedBrand: string | null;
  priorityKeys: readonly string[];
  /** Same feature chip as the catalog (5G, 120Hz, slim, …) */
  activeFeatureKey?: string | null;
  limit?: number;
}): AiRankedPhone[] {
  const limit = opts.limit ?? 3;
  let list = PHONES.filter(
    (p) => p.price >= opts.budgetMin && p.price <= opts.budgetMax,
  );
  if (opts.selectedBrand) {
    list = list.filter((p) => p.brand === opts.selectedBrand);
  }
  const feat = opts.activeFeatureKey ?? null;
  if (feat) {
    list = list.filter((p) => phoneMatchesFeatureKey(p, feat));
  }
  const w = combinePriorityWeights(opts.priorityKeys);
  const ranked = list
    .map((phone) => ({
      phone,
      aiScore: weightedCatalogScore(phone, w),
    }))
    .sort((a, b) => b.aiScore - a.aiScore);
  return ranked.slice(0, limit);
}
