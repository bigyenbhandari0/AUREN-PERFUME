import { type CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  /** oklch accent tint for the overhead light */
  glow: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

function PhotoLayers({ src, alt, imgClassName, loading }: Pick<Props, "src" | "alt" | "imgClassName" | "loading">) {
  return <>
    <img src={src} alt={alt} loading={loading} decoding="async" draggable={false} className={`photo-niche-img ${imgClassName ?? ""}`} />
    <div className="photo-niche-light" aria-hidden />
    <div className="photo-niche-source" aria-hidden />
    <div className="photo-niche-pool" aria-hidden />
  </>;
}

/** A DOM floor mirror shares all photograph and lighting states with its source. */
export function ProductPhoto({ src, alt, glow, className = "", imgClassName = "", loading = "lazy" }: Props) {
  return (
    <div
      className={`photo-niche ${className}`}
      style={{ "--glow": glow } as CSSProperties}
    >
      <div className="photo-niche-original"><PhotoLayers src={src} alt={alt} imgClassName={imgClassName} loading={loading} /></div>
      <div className="photo-overhead-light photo-niche-light" aria-hidden />
      <div className="photo-overhead-source photo-niche-source" aria-hidden />
      <div className="photo-floor-mirror" aria-hidden="true"><div className="photo-floor-mirrored-layers"><PhotoLayers src={src} alt="" imgClassName={imgClassName} loading={loading} /></div></div>
      <div className="photo-contact-shadow" aria-hidden />
    </div>
  );
}
