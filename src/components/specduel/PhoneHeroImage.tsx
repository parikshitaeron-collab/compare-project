"use client";

import PhoneImage from "@/components/specduel/PhoneImage";

type Props = { src: string; alt: string };

export default function PhoneHeroImage({ src, alt }: Props) {
  return (
    <PhoneImage
      className="bpc-img"
      src={src}
      alt={alt}
      loading="eager"
      style={{ maxHeight: 280 }}
    />
  );
}
