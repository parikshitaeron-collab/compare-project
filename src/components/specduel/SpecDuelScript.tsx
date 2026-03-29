"use client";

import Script from "next/script";

export default function SpecDuelScript() {
  return <Script src="/specduel.js" strategy="afterInteractive" />;
}
