import Link from "next/link";
import { notFound } from "next/navigation";

import SpecDuelShell from "@/components/specduel/SpecDuelShell";
import BrandPhoneCard from "@/components/specduel/BrandPhoneCard";
import { brandNameFromPathSlug } from "@/lib/brand-utils";
import { PHONES } from "@/lib/phones.js";

const SLUGS = [
  "apple",
  "samsung",
  "google",
  "oneplus",
  "xiaomi",
  "nothing",
  "motorola",
  "realme",
  "oppo",
  "vivo",
  "asus",
  "poco",
  "infinix",
] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = brandNameFromPathSlug(slug);
  if (!brand) notFound();

  const phones = PHONES.filter((p) => p.brand === brand).sort(
    (a, b) => b.scores.overall - a.scores.overall,
  );

  return (
    <SpecDuelShell>
      <section
        className="budget-section"
        style={{ paddingBottom: 48, maxWidth: 1100, margin: "0 auto" }}
      >
        <div className="step-badge" style={{ marginTop: 24 }}>
          <div className="step-num">◆</div> {brand}
        </div>
        <p
          style={{
            color: "var(--t3)",
            fontSize: "0.9rem",
            marginBottom: 20,
            maxWidth: 640,
          }}
        >
          {phones.length} phone{phones.length !== 1 ? "s" : ""} in our catalog.
          Tap a card for full specs.
        </p>
        <Link
          href="/"
          className="budget-find-btn"
          style={{
            display: "inline-flex",
            marginBottom: 28,
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          <span>← Back to home</span>
        </Link>
        <div className="budget-cards-grid">
          {phones.map((p, index) => (
            <BrandPhoneCard key={p.id} phone={p} index={index} />
          ))}
        </div>
      </section>
    </SpecDuelShell>
  );
}
