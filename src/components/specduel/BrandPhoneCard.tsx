"use client";

import Link from "next/link";

import PhoneImage from "@/components/specduel/PhoneImage";
import type { CatalogPhone } from "@/lib/catalog-filter";

export default function BrandPhoneCard({
  phone: p,
  index,
}: {
  phone: CatalogPhone;
  index: number;
}) {
  return (
    <Link
      href={`/phone/${p.id}`}
      className={"bpc" + (index === 0 ? " best-choice" : "")}
      style={{
        textDecoration: "none",
        color: "inherit",
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {index === 0 ? <div className="best-tag">⭐ Top pick</div> : null}
      <div className="bpc-img-wrap">
        <PhoneImage
          className="bpc-img"
          src={p.image}
          alt={p.name}
        />
      </div>
      <div className="bpc-body">
        <div className="bpc-name">{p.name}</div>
        <div className="bpc-price">₹{p.price.toLocaleString("en-IN")}</div>
        <div className="bpc-specs">
          <span className="bpc-spec">💾 {p.specs.ram}</span>
          <span className="bpc-spec">📷 {p.specs.camera}</span>
          <span className="bpc-spec">🔋 {p.specs.battery}</span>
        </div>
        <div className="bpc-overall">
          <span className="bpc-overall-lbl">Overall</span>
          <span className="bpc-overall-num">{p.scores.overall.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
