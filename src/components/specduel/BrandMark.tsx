"use client";

import { useState } from "react";

type Props = {
  src: string;
  brandName: string;
};

/** Brand row logo with resilient fallback to Apple mark if asset fails */
export default function BrandMark({ src, brandName }: Props) {
  const [failed, setFailed] = useState(false);
  const url = failed ? "/brands/placeholder.svg" : src;

  return (
    <img
      src={url}
      alt={`${brandName} logo`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
