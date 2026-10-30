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

/**
 * A perfume photograph in its display niche. The lighting is baked into the
 * photograph; hover/focus only brightens it slightly and fades in a soft,
 * tinted overhead glow plus a faint light pool near the base. Pointer
 * tracking nudges the glow center via CSS variables (rAF, no re-renders),
 * and only on devices with hover + fine pointer.
 */
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
