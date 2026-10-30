import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPhoto } from "@/components/ProductPhoto";
import { perfumes, formatNPR, type Size } from "@/lib/perfumes";
import { perfumeImages, storyBackground } from "@/lib/perfume-assets";

type Phase = "collection" | "opening" | "detail" | "closing";
type Props = { onAdd: (id: string, size: Size) => void; homeSignal: number };

function RoomBackground() {
  return <div className="room-background" aria-hidden="true"><img src={storyBackground} alt="" /><div className="room-floor" /></div>;
}

export function PerfumeScene({ onAdd, homeSignal }: Props) {
  const [phase, setPhase] = useState<Phase>("collection");
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState<Size>("50");
  const [position, setPosition] = useState(0);
  const sources = useRef<(HTMLDivElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const destination = useRef<HTMLDivElement>(null);
  const moving = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const start = useRef<DOMRect | null>(null);
  const busy = useRef(false);
  const mounted = useRef(true);
  const animation = useRef<Animation | null>(null);
  const p = perfumes[index];

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; animation.current?.cancel(); };
  }, []);

  const open = async (i: number) => {
    const element = sources.current[i];
    const perfume = perfumes[i];
    if (busy.current || phase !== "collection" || !element || !perfume) return;
    busy.current = true;
    const image = element.querySelector("img");
    try { await image?.decode(); } catch { /* The loaded image can still be displayed. */ }
    if (!mounted.current) return;
    start.current = element.getBoundingClientRect();
    setIndex(i);
    setSize("50");
    setPhase("opening");
  };

  const close = () => {
    if (busy.current || phase !== "detail" || !destination.current) return;
    busy.current = true;
    const panel = destination.current.closest("[role=dialog]");
    if (panel instanceof HTMLElement) panel.scrollTop = 0;
    start.current = destination.current.getBoundingClientRect();
    setPhase("closing");
  };

  const navigate = (direction: number) => {
    if (busy.current || phase !== "detail") return;
    setIndex((current) => (current + direction + perfumes.length) % perfumes.length);
  };

  useEffect(() => {
    if (homeSignal > 0) close();
  }, [homeSignal]);

  useEffect(() => {
    if (phase === "collection") return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector("[data-bag-open]")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "Tab" && phase === "detail") {
        const panel = destination.current?.closest("[role=dialog]");
        const controls = panel?.querySelectorAll<HTMLElement>("button:not([disabled])");
        const first = controls?.[0];
        const last = controls?.[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = old; window.removeEventListener("keydown", onKey); };
  }, [phase, index]);

  useLayoutEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const overlay = moving.current;
    const from = start.current;
    const target = phase === "opening" ? destination.current : sources.current[index];
    if (!overlay || !from || !target) return;
    const to = target.getBoundingClientRect();
    const frame = (rect: DOMRect) => ({ left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    Object.assign(overlay.style, frame(from));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = overlay.animate(reduced ? [frame(to), frame(to)] : [frame(from), frame(to)], {
      duration: reduced ? 1 : 950,
      easing: "cubic-bezier(0.65, 0, 0.25, 1)",
      fill: "forwards",
    });
    animation.current = motion;
    motion.finished.then(() => {
      if (!mounted.current) return;
      busy.current = false;
      setPhase(phase === "opening" ? "detail" : "collection");
      requestAnimationFrame(() => {
        if (phase === "opening") back.current?.focus({ preventScroll: true });
        else buttons.current[index]?.focus({ preventScroll: true });
      });
    }).catch(() => {});
    return () => { motion.cancel(); animation.current = null; };
  }, [phase, index]);

  if (!p) return null;
  const transitioning = phase === "opening" || phase === "closing";

  return (
    <section id="collection" className={`gallery-room phase-${phase}`}>
      <RoomBackground />
      <div className="collection-content" inert={phase !== "collection"}>
        <div className="niche-gallery no-scrollbar" onScroll={(event) => {
          const el = event.currentTarget;
          const first = el.firstElementChild as HTMLElement | null;
          if (first) setPosition(Math.round(el.scrollLeft / (first.offsetWidth + 24)));
        }}>
          {perfumes.map((perfume, i) => (
            <Button key={perfume.id} ref={(el) => { buttons.current[i] = el; }} variant="ghost"
              className={`collection-niche ${phase !== "collection" && index === i ? "selected-niche" : ""}`}
              aria-label={`Discover ${perfume.name}`} onClick={() => open(i)}>
              <div ref={(el) => { sources.current[i] = el; }} className="niche-image-box">
                <ProductPhoto src={perfumeImages[perfume.id] ?? ""} alt={`${perfume.name} perfume in an illuminated stone niche`} glow={perfume.glow} loading="eager" />
              </div>
              <span className="niche-caption"><span>{perfume.name}</span><span className="niche-discover">Discover <ArrowRight size={11} /></span></span>
            </Button>
          ))}
        </div>
        <div className="collection-lockup">
          <p>A presence that lingers.</p>
          <h1>The <em>after-dark</em> collection</h1>
          <span>Five expressions. One lasting impression.</span>
        </div>
        <div className="gallery-position" aria-label={`Perfume ${Math.min(position + 1, 5)} of 5`}>
          {perfumes.map((perfume, i) => <span key={perfume.id} className={i === position ? "current" : ""} />)}
        </div>
      </div>

      {phase !== "collection" && <div className={`detail-room phase-${phase}`} role="dialog" aria-modal="true" aria-label={p.name}>
        <RoomBackground />
        <div className="detail-layout">
          <div className="detail-information" inert={phase !== "detail"}>
            <p className="detail-eyebrow">{String(index + 1).padStart(2, "0")} / 05 — {p.character}</p>
            <h2>{p.name}</h2>
            <p className="detail-description">{p.description}</p>
            <dl className="detail-notes">{["Top", "Heart", "Base"].map((label, i) => <div key={label}><dt>{label}</dt><dd>{p.notes[i]}</dd></div>)}</dl>
            <div className="detail-purchase-row">
              <div className="flex shrink-0 gap-2" role="radiogroup" aria-label="Size">
                {(["50", "100"] as Size[]).map((value) => <Button key={value} variant={size === value ? "default" : "outline"} role="radio" aria-checked={size === value} onClick={() => setSize(value)} className="rounded-none px-3">{value} ml</Button>)}
              </div>
              <span className="font-serif text-xl whitespace-nowrap">{formatNPR(p.prices[size])}</span>
            </div>
            <Button className="detail-add rounded-none" onClick={() => onAdd(p.id, size)}>Add to bag</Button>
            <div className="detail-navigation">
              <Button ref={back} variant="ghost" className="back-control" onClick={close}><ArrowLeft /> Back to collection</Button>
              <div className="flex gap-2"><Button variant="outline" size="icon" title="Previous perfume" aria-label="Previous perfume" onClick={() => navigate(-1)}><ChevronLeft /></Button><Button variant="outline" size="icon" title="Next perfume" aria-label="Next perfume" onClick={() => navigate(1)}><ChevronRight /></Button></div>
            </div>
          </div>
          <div ref={destination} className={`detail-niche ${transitioning ? "niche-hidden" : ""}`}>
            <ProductPhoto key={p.id} src={perfumeImages[p.id] ?? ""} alt={`${p.name} perfume in an illuminated stone niche`} glow={p.glow} loading="eager" />
          </div>
        </div>
      </div>}
      {transitioning && <div ref={moving} className="moving-niche" aria-hidden="true"><ProductPhoto src={perfumeImages[p.id] ?? ""} alt="" glow={p.glow} loading="eager" /></div>}
    </section>
  );
}