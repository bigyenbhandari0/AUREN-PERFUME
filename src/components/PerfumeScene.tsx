import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPhoto } from "@/components/ProductPhoto";
import { perfumes, formatNPR, type Size } from "@/lib/perfumes";
import { perfumeImages, storyBackground } from "@/lib/perfume-assets";
import { cameraTransform, CAMERA_DURATION, type SceneRect } from "@/lib/scene-camera";

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
  const world = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const baseRects = useRef<SceneRect[]>([]);
  const origin = useRef("translate(0px, 0px) scale(1)");
  const busy = useRef(false);
  const mounted = useRef(true);
  const animation = useRef<Animation | null>(null);
  const p = perfumes[index];
  const detailOpen = phase !== "collection";

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; animation.current?.cancel(); };
  }, []);

  const open = async (i: number) => {
    const element = sources.current[i];
    const perfume = perfumes[i];
    const plane = world.current;
    const scene = room.current;
    if (busy.current || phase !== "collection" || !element || !perfume || !plane || !scene) return;
    busy.current = true;
    const image = element.querySelector("img");
    try { if (image && (!image.complete || !image.naturalWidth)) await image.decode(); } catch { /* The loaded image can still be displayed. */ }
    if (!mounted.current) return;
    const bounds = scene.getBoundingClientRect();
    baseRects.current = sources.current.map((source) => {
      const rect = source?.querySelector(".photo-niche-original")?.getBoundingClientRect() ?? source?.getBoundingClientRect();
      return { left: (rect?.left ?? 0) - bounds.left, top: (rect?.top ?? 0) - bounds.top, width: rect?.width ?? 1, height: rect?.height ?? 1 };
    });
    plane.style.width = `${bounds.width}px`;
    plane.style.height = `${bounds.height}px`;
    origin.current = `translate(${bounds.left}px, ${bounds.top}px) scale(1)`;
    plane.style.transform = origin.current;
    setIndex(i);
    setSize("50");
    setPhase("opening");
  };

  const close = () => {
    if (busy.current || phase !== "detail" || !destination.current) return;
    busy.current = true;
    const panel = destination.current.closest("[role=dialog]");
    if (panel instanceof HTMLElement) panel.scrollTop = 0;
    if (world.current) world.current.style.translate = "";
    setPhase("closing");
  };

  const navigate = (direction: number) => {
    if (busy.current || phase !== "detail") return;
    busy.current = true;
    const panel = destination.current?.closest("[role=dialog]");
    if (panel instanceof HTMLElement) panel.scrollTop = 0;
    if (world.current) world.current.style.translate = "";
    setIndex((current) => (current + direction + perfumes.length) % perfumes.length);
    setSize("50");
    setPhase("opening");
  };

  useEffect(() => {
    if (homeSignal > 0) close();
  }, [homeSignal]);

  useLayoutEffect(() => {
    if (!detailOpen) return;
    const body = document.body;
    const root = document.documentElement;
    const y = window.scrollY;
    const old = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow, rootOverflow: root.style.overflow };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    return () => {
      Object.assign(body.style, { position: old.position, top: old.top, width: old.width, overflow: old.overflow });
      root.style.overflow = old.rootOverflow;
      window.scrollTo({ top: y, behavior: "instant" });
    };
  }, [detailOpen]);

  useEffect(() => {
    if (phase === "collection") return;
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
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, index]);

  // Reset the fixed camera and its dimensions in the same commit as the collection.
  // Clearing them before React commits exposes one frame in the old fixed viewport.
  useLayoutEffect(() => {
    if (phase !== "collection" || !world.current) return;
    world.current.style.transform = "";
    world.current.style.translate = "";
    world.current.style.width = "";
    world.current.style.height = "";
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const plane = world.current;
    const source = baseRects.current[index];
    const target = destination.current;
    if (!plane || !source || !target) return;
    const camera = cameraTransform(source, target.getBoundingClientRect());
    const to = phase === "closing" ? origin.current : `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
    const from = plane.style.transform || origin.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = plane.animate(reduced ? [{ transform: to }, { transform: to }] : [{ transform: from }, { transform: to }], {
      duration: reduced ? 1 : CAMERA_DURATION,
      easing: "cubic-bezier(0.65, 0, 0.25, 1)",
      fill: "forwards",
    });
    animation.current = motion;
    motion.finished.then(() => {
      if (!mounted.current) return;
      plane.style.transform = to;
      busy.current = false;
      flushSync(() => setPhase(phase === "opening" ? "detail" : "collection"));
      motion.cancel();
      requestAnimationFrame(() => {
        if (phase === "opening") back.current?.focus({ preventScroll: true });
        else {
          const button = buttons.current[index];
          button?.setAttribute("data-restored-focus", "");
          button?.focus({ preventScroll: true });
        }
      });
    }).catch(() => {});
    return () => { motion.cancel(); animation.current = null; };
  }, [phase, index]);

  if (!p) return null;

  return (
    <section ref={room} id="collection" className={`gallery-room phase-${phase}`}>
      <div className="gallery-signature" aria-hidden="true">
        <span className="signature-label">After dark</span>
        <span className="signature-rule" />
        <svg className="signature-seal" viewBox="0 0 48 48" fill="none">
          <ellipse cx="24" cy="24" rx="15" ry="20" />
          <path d="M24 9C24 20 20 24 11 24C20 24 24 28 24 39C24 28 28 24 37 24C28 24 24 20 24 9Z" />
          <circle cx="24" cy="24" r="3" />
        </svg>
        <span className="signature-rule" />
        <span className="signature-label">Five expressions</span>
      </div>
      <div className="camera-viewport"><div ref={world} className="camera-world">
      <RoomBackground />
      <div className="collection-content" inert={phase !== "collection"}>
        <div className="niche-gallery no-scrollbar" onScroll={(event) => {
          const el = event.currentTarget;
          const first = el.firstElementChild as HTMLElement | null;
          if (first) {
            const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
            setPosition(Math.max(0, Math.min(perfumes.length - 1, Math.round(el.scrollLeft / (first.offsetWidth + gap)))));
          }
        }}>
          {perfumes.map((perfume, i) => (
            <Button key={perfume.id} ref={(el) => { buttons.current[i] = el; }} variant="ghost"
              className={`collection-niche ${position === i ? "touch-active" : ""} ${phase !== "collection" && index === i ? "selected-niche" : ""}`}
              onBlur={(event) => event.currentTarget.removeAttribute("data-restored-focus")}
              onKeyDown={(event) => event.currentTarget.removeAttribute("data-restored-focus")}
              aria-label={`Discover ${perfume.name}`} aria-haspopup="dialog" onClick={() => open(i)}>
              <div ref={(el) => { sources.current[i] = el; }} className="niche-image-box">
                <ProductPhoto src={perfumeImages[perfume.id] ?? ""} alt={`${perfume.name} perfume in an illuminated stone niche`} glow={perfume.glow} loading="eager" />
              </div>
              <span className="niche-caption"><span>{perfume.name}</span><span className="niche-discover">Discover <ArrowRight size={11} /></span></span>
            </Button>
          ))}
        </div>
      </div></div></div>
      <div className="collection-editorial" inert={phase !== "collection"}>
        <div className="collection-lockup">
          <p>A presence that lingers.</p>
          <h1>The <em>after-dark</em> collection</h1>
          <span>Five expressions. One lasting impression.</span>
        </div>
        <div className="gallery-position" aria-label={`Perfume ${Math.min(position + 1, 5)} of 5`}>
          {perfumes.map((perfume, i) => <span key={perfume.id} className={i === position ? "current" : ""} />)}
        </div>
      </div>

      {phase !== "collection" && <div className={`detail-room phase-${phase}`} role="dialog" aria-modal="true" aria-label={p.name}
        onScroll={(event) => {
          if (phase === "detail" && world.current) world.current.style.translate = `0px ${-event.currentTarget.scrollTop}px`;
        }}>
        <div className="detail-layout">
          <div key={p.id} className="detail-information" inert={phase !== "detail"}>
            <p className="detail-edition">The after-dark collection</p>
            <p className="detail-eyebrow">{String(index + 1).padStart(2, "0")} / 05 — {p.character}</p>
            <h2>{p.name}</h2>
            <p className="detail-description">{p.description}</p>
            <dl className="detail-notes">{["Top", "Heart", "Base"].map((label, i) => <div key={label}><dt>{label}</dt><dd>{p.notes[i]}</dd></div>)}</dl>
            <p className="detail-size-label">Select volume</p>
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
          <div ref={destination} className="detail-niche" aria-hidden="true" />
        </div>
      </div>}
    </section>
  );
}