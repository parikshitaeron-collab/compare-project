"use client";

import { useRouter } from "next/navigation";

import BrandMark from "@/components/specduel/BrandMark";
import { BRANDS } from "@/data/brands";

export default function BrandsSection() {
  const router = useRouter();

  return (
    <section className="brands-section">
      <div className="section-header">
        <span className="section-title">🏷️ Featured Mobile Brands</span>
        <span className="section-sub">Tap a brand to see all its phones →</span>
      </div>
      <div className="brands-track">
        {BRANDS.map((b) => (
          <button
            key={b.name}
            type="button"
            className="brand-card"
            style={{
              appearance: "none",
              font: "inherit",
              textDecoration: "none",
              border: "none",
              background: "transparent",
            }}
            onClick={() => router.push(`/brand/${b.slug}`)}
          >
            <div className="logo-box" aria-hidden>
              <BrandMark src={b.logo} brandName={b.name} />
            </div>
            <span className="brand-name">{b.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
