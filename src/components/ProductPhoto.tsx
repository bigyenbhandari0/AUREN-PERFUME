import { type CSSProperties } from "react";
import { capProfiles } from "@/lib/cap-animation";

type Props = {
  src: string;
  productId?: string;
  capAnimation?: boolean;
  alt: string;
  /** oklch accent tint for the overhead light */
  glow: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

function PhotoLayers({ src, alt, imgClassName, loading, capAnimation, productId = "ember-veil" }: Pick<Props, "src" | "alt" | "imgClassName" | "loading" | "capAnimation" | "productId">) {
  const profile = capAnimation ? capProfiles[productId] : undefined;
  return <>
    <img src={profile?.background ?? src} alt={profile ? "" : alt} loading={loading} decoding="async" draggable={false} className={`photo-niche-img ${imgClassName ?? ""}`} />
    {profile && <div className="photo-product-rig">
      <img src={profile.uncapped} alt={alt} decoding="async" draggable={false} className="photo-bottle" />
      <img src={src} alt="" aria-hidden="true" decoding="async" draggable={false} className="photo-cap" />
    </div>}
    <div className="photo-niche-light" aria-hidden />
    <div className="photo-niche-source" aria-hidden />
    <div className="photo-niche-pool" aria-hidden />
  </>;
}

/** A DOM floor mirror shares all photograph and lighting states with its source. */
export function ProductPhoto({ src, alt, glow, className = "", imgClassName = "", loading = "lazy", capAnimation = false, productId = "ember-veil" }: Props) {
  const profile = capProfiles[productId];
  return (
    <div
      className={`photo-niche ${className}`}
      style={{ "--glow": glow, "--cap-clip": profile?.capClip, "--bottle-clip": profile?.bottleClip, "--cap-origin": profile?.capOrigin, "--product-origin": profile?.productOrigin } as CSSProperties}
    >
      <div className="photo-niche-original"><PhotoLayers src={src} alt={alt} imgClassName={imgClassName} loading={loading} capAnimation={capAnimation} productId={productId} /></div>
      <div className="photo-overhead-light photo-niche-light" aria-hidden />
      <div className="photo-overhead-source photo-niche-source" aria-hidden />
      <div className="photo-floor-mirror" aria-hidden="true"><div className="photo-floor-mirrored-layers"><PhotoLayers src={src} alt="" imgClassName={imgClassName} loading={loading} capAnimation={capAnimation} productId={productId} /></div></div>
      <div className="photo-contact-shadow" aria-hidden />
    </div>
  );
}
