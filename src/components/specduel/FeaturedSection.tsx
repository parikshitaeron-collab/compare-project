"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import PhoneImage from "@/components/specduel/PhoneImage";
import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";
import type { CatalogPhone } from "@/lib/catalog-filter";

function FeaturedPhoneCard({
  phone,
  index,
  onAddCompare,
}: {
  phone: CatalogPhone;
  index: number;
  onAddCompare: (phone: CatalogPhone) => void;
}) {
  const router = useRouter();
  const badgeText =
    phone.tier === "flagship"
      ? "🏆 Flagship"
      : phone.year >= 2024
        ? "✨ New"
        : "⭐ Popular";
  const badgeCls =
    phone.tier === "flagship"
      ? "flagship"
      : phone.year >= 2024
        ? "new"
        : "premium";

  return (
    <div className="fp-card" style={{ animationDelay: `${index * 0.09}s` }}>
      <div
        role="link"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        onClick={() => router.push(`/phone/${phone.id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/phone/${phone.id}`);
          }
        }}
      >
        <div className="fp-img-wrap">
          <span className={`fp-badge ${badgeCls}`}>{badgeText}</span>
          <PhoneImage
            className="fp-img"
            src={phone.image}
            alt={phone.name}
          />
        </div>
        <div className="fp-body">
          <div className="fp-name">{phone.name}</div>
          <div className="fp-price">
            ₹{phone.price.toLocaleString("en-IN")}
          </div>
          <div className="fp-specs-mini">
            <span className="fp-spec-chip">💾 {phone.specs.ram}</span>
            <span className="fp-spec-chip">📷 {phone.specs.camera}</span>
            <span className="fp-spec-chip">🔋 {phone.specs.battery}</span>
          </div>
        </div>
      </div>
      <div className="fp-actions">
        <button
          type="button"
          className="fp-btn-details"
          onClick={() => router.push(`/phone/${phone.id}`)}
        >
          👁 View Details
        </button>
        <button
          type="button"
          className="fp-btn-compare"
          onClick={(e) => {
            e.stopPropagation();
            onAddCompare(phone);
          }}
        >
          + Compare
        </button>
      </div>
    </div>
  );
}

export default function FeaturedSection() {
  const {
    filteredCatalog,
    comparePhoneA,
    comparePhoneB,
    setComparePhoneA,
    setComparePhoneB,
    catalogSectionRef,
  } = useCatalogFilters();

  const featured = useMemo(
    () => filteredCatalog.slice(0, 5),
    [filteredCatalog],
  );

  const addToCompare = useCallback(
    (phone: CatalogPhone) => {
      const a = comparePhoneA.trim();
      const b = comparePhoneB.trim();
      const name = phone.name;
      if (!a) {
        setComparePhoneA(name);
      } else if (!b && a.toLowerCase() !== name.toLowerCase()) {
        setComparePhoneB(name);
      } else {
        setComparePhoneA(name);
      }
      catalogSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [
      comparePhoneA,
      comparePhoneB,
      setComparePhoneA,
      setComparePhoneB,
      catalogSectionRef,
    ],
  );

  return (
    <section className="featured-section" id="featuredSection">
      <div className="glass" style={{ padding: "24px 28px" }}>
        <div className="section-header">
          <span className="section-title">🔥 Featured Phones</span>
          <span className="section-sub">
            Updates live with your filters — tap + Compare to fill slots
          </span>
        </div>
        <div className="featured-grid" id="featuredGrid">
          {featured.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "var(--t4)",
                fontSize: "0.9rem",
                padding: "24px 12px",
              }}
            >
              No phones match the current budget, brand, feature, or search
              filters.
            </p>
          ) : (
            featured.map((phone, i) => (
              <FeaturedPhoneCard
                key={phone.id}
                phone={phone}
                index={i}
                onAddCompare={addToCompare}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
