import Link from "next/link";
import { notFound } from "next/navigation";

import SpecDuelShell from "@/components/specduel/SpecDuelShell";
import PhoneHeroImage from "@/components/specduel/PhoneHeroImage";
import { brandSlugFromName } from "@/lib/brand-utils";
import { PHONES, findPhone } from "@/lib/phones.js";

export function generateStaticParams() {
  return PHONES.map((p) => ({ slug: p.id }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function PhonePage({ params }: Props) {
  const { slug } = await params;
  const phone = findPhone(slug);
  if (!phone) notFound();

  const { scores } = phone;

  return (
    <SpecDuelShell>
      <article
        style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 56px" }}
      >
        <Link
          href="/"
          className="budget-find-btn"
          style={{
            display: "inline-flex",
            marginBottom: 16,
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          <span>← Home</span>
        </Link>
        <Link
          href={`/brand/${brandSlugFromName(phone.brand)}`}
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--a1)",
            marginBottom: 8,
            textDecoration: "none",
          }}
        >
          {phone.brand}
        </Link>
        <h1
          style={{
            fontSize: "1.65rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 12,
            color: "var(--t1)",
          }}
        >
          {phone.name}
        </h1>
        <div
          className="glass"
          style={{ padding: 24, marginBottom: 20 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 24,
              alignItems: "center",
            }}
            className="phone-detail-top-grid"
          >
            <PhoneHeroImage
              src={phone.image}
              alt={phone.name}
            />
            <div>
              <div
                className="bpc-price"
                style={{ fontSize: "1.35rem", marginBottom: 16 }}
              >
                ₹{phone.price.toLocaleString("en-IN")}
              </div>
              <div className="insight-grid" style={{ marginBottom: 0 }}>
                <div className="insight-block">
                  <div className="ib-name">⚡ Performance</div>
                  <div className="ib-line">{scores.performance.toFixed(1)} / 10</div>
                </div>
                <div className="insight-block">
                  <div className="ib-name">📸 Camera</div>
                  <div className="ib-line">{scores.camera.toFixed(1)} / 10</div>
                </div>
                <div className="insight-block">
                  <div className="ib-name">🔋 Battery</div>
                  <div className="ib-line">{scores.battery.toFixed(1)} / 10</div>
                </div>
                <div className="insight-block">
                  <div className="ib-name">⭐ Overall</div>
                  <div className="ib-line">{scores.overall.toFixed(1)} / 10</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass budget-panel">
          <div className="budget-header">
            <div className="budget-icon-wrap">📋</div>
            <span className="budget-hdr-text">Specifications</span>
          </div>
          <div className="insight-card" style={{ marginTop: 0, boxShadow: "none" }}>
            <div className="insight-grid">
              {[
                ["Processor", phone.processor],
                ["RAM", phone.ram],
                ["Storage", phone.storage],
                ["Battery", phone.battery],
                ["Camera", phone.camera],
                ["Display", phone.display],
                ["OS", phone.os],
                ["Tier", phone.tier],
                ["Year", String(phone.year)],
              ].map(([k, v]) => (
                <div key={k} className="insight-block">
                  <div className="ib-name">{k}</div>
                  <div className="ib-line" style={{ fontSize: "0.85rem" }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
      <style>{`
        @media (max-width: 700px) {
          .phone-detail-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </SpecDuelShell>
  );
}
