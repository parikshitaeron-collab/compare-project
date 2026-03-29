/** Brand row — `name` must match `brand` on phones; `slug` is the /brand/[slug] path */

export type BrandInfo = {
  name: string;
  slug: string;
  /** Local asset under /public/brands */
  logo: string;
  color: string;
};

export const BRANDS: BrandInfo[] = [
  { name: "Apple", slug: "apple", logo: "/brands/apple.svg", color: "#1d1d1f" },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/brands/samsung.png",
    color: "#1428A0",
  },
  { name: "Google", slug: "google", logo: "/brands/google.svg", color: "#4285F4" },
  {
    name: "OnePlus",
    slug: "oneplus",
    logo: "/brands/oneplus.png",
    color: "#F5010C",
  },
  { name: "Xiaomi", slug: "xiaomi", logo: "/brands/xiaomi.svg", color: "#FF6900" },
  {
    name: "Nothing",
    slug: "nothing",
    logo: "/brands/nothing.png",
    color: "#111111",
  },
  {
    name: "Motorola",
    slug: "motorola",
    logo: "/brands/motorola.png",
    color: "#E1140A",
  },
  { name: "Realme", slug: "realme", logo: "/brands/realme.png", color: "#FFC107" },
  { name: "OPPO", slug: "oppo", logo: "/brands/oppo.png", color: "#1D8348" },
  { name: "Vivo", slug: "vivo", logo: "/brands/vivo.svg", color: "#415FFF" },
  { name: "Asus", slug: "asus", logo: "/brands/asus.svg", color: "#00539B" },
  { name: "Poco", slug: "poco", logo: "/brands/poco.png", color: "#ffca28" },
  {
    name: "Infinix",
    slug: "infinix",
    logo: "/brands/infinix.png",
    color: "#39ff14",
  },
];
