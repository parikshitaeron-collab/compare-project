/** URL slug → exact `brand` string on phones */

const SLUG_TO_BRAND: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  google: "Google",
  oneplus: "OnePlus",
  xiaomi: "Xiaomi",
  nothing: "Nothing",
  motorola: "Motorola",
  realme: "Realme",
  oppo: "OPPO",
  vivo: "Vivo",
  asus: "Asus",
  poco: "Poco",
  infinix: "Infinix",
};

export function brandNameFromPathSlug(slug: string): string | null {
  const key = slug.trim().toLowerCase();
  return SLUG_TO_BRAND[key] ?? null;
}

export function brandSlugFromName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
