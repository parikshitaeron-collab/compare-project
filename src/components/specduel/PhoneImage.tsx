"use client";

import { useState, type CSSProperties } from "react";

import { PHONE_IMG_FALLBACK } from "@/constants/images";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  style?: CSSProperties;
};

/**
 * Always renders a non-empty src; falls back to PNG on error or missing URL.
 */
export default function PhoneImage({
  src,
  alt,
  className,
  loading = "lazy",
  style,
}: Props) {
  const [useFallback, setUseFallback] = useState(false);
  const primary = (src && String(src).trim()) || "";
  const url = useFallback || !primary ? PHONE_IMG_FALLBACK : primary;

  return (
    <img
      className={className}
      src={url}
      alt={alt}
      loading={loading}
      decoding="async"
      style={style}
      onError={() => setUseFallback(true)}
    />
  );
}
