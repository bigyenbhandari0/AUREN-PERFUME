import { type CSSProperties } from "react";
import { EMBER_UNCAPPED } from "@/lib/cap-animation";

type Props = {
  src: string;
  capAnimation?: boolean;
  alt: string;
  /** oklch accent tint for the overhead light */
  glow: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

function PhotoLayers({ src, alt, imgClassName, loading, capAnimation }: Pick<Props, "src" | "alt" | "imgClassName" | "loading" | "capAnimation">) {
  return <>
    <img src={capAnimation ? EMBER_UNCAPPED : src} alt={alt} loading={loading} decoding="async" draggable={false} className={`photo-niche-img ${imgClassName ?? ""}`} />
    {capAnimation && <img src={src} alt="" aria-hidden="true" decoding="async" draggable={false} className="photo-cap" />}
    <div className="photo-niche-light" aria-hidden />
    <div className="photo-niche-source" aria-hidden />
    <div className="photo-niche-pool" aria-hidden />
  </>;
}

/** A DOM floor mirror shares all photograph and lighting states with its source. */
export function ProductPhoto({ src, alt, glow, className = "", imgClassName = "", loading = "lazy", capAnimation = false }: Props) {
  return (
    <div
      className={`photo-niche ${className}`}
      style={{ "--glow": glow } as CSSProperties}
    >
      <div className="photo-niche-original"><PhotoLayers src={src} alt={alt} imgClassName={imgClassName} loading={loading} capAnimation={capAnimation} /></div>
      <div className="photo-overhead-light photo-niche-light" aria-hidden />
      <div className="photo-overhead-source photo-niche-source" aria-hidden />
      <div className="photo-floor-mirror" aria-hidden="true"><div className="photo-floor-mirrored-layers"><PhotoLayers src={src} alt="" imgClassName={imgClassName} loading={loading} capAnimation={capAnimation} /></div></div>
      <div className="photo-contact-shadow" aria-hidden />
    </div>
  );
}
