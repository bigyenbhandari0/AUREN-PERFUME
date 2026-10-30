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

/** The complete photograph with fixed overhead, stone and shelf light layers. */
export function ProductPhoto({ src, alt, glow, className = "", imgClassName = "", loading = "lazy" }: Props) {
  return (
    <div
      className={`photo-niche ${className}`}
      style={{ "--glow": glow } as CSSProperties}
    >
      <img src={src} alt={alt} loading={loading} className={`photo-niche-img ${imgClassName}`} />
      <div className="photo-niche-light" aria-hidden />
      <div className="photo-niche-source" aria-hidden />
      <div className="photo-niche-pool" aria-hidden />
    </div>
  );
}
