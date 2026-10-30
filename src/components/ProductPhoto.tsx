import { useEffect, useRef, type CSSProperties } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let raf = 0;
    let tx = 50;
    let ty = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--lx", `${tx}%`);
      el.style.setProperty("--ly", `${ty}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Small range around the overhead anchor — the light stays above the bottle.
      tx = 50 + ((e.clientX - r.left) / r.width - 0.5) * 14;
      ty = Math.max(0, Math.min(10, ((e.clientY - r.top) / r.height) * 10));
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = 50;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`photo-niche ${className}`}
      style={{ "--glow": glow, "--lx": "50%", "--ly": "0%" } as CSSProperties}
    >
      <img src={src} alt={alt} loading={loading} className={`photo-niche-img ${imgClassName}`} />
      <div className="photo-niche-light" aria-hidden />
      <div className="photo-niche-pool" aria-hidden />
    </div>
  );
}
