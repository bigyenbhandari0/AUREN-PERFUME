import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PerfumeScene } from "@/components/PerfumeScene";
import { Button } from "@/components/ui/button";
import { perfumes, formatNPR } from "@/lib/perfumes";
import { perfumeImages, storyBackground } from "@/lib/perfume-assets";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your product — The after-dark collection" },
      { name: "description", content: "A presence that lingers. Five original fragrances displayed in an after-dark boutique gallery." },
      { property: "og:title", content: "Your product — The after-dark collection" },
      { property: "og:description", content: "Five expressions. One lasting impression." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(storyBackground.startsWith("https://") ? [
        { property: "og:image", content: storyBackground },
        { name: "twitter:image", content: storyBackground },
      ] : []),
    ],
  }),
  component: Index,
});

function Index() {
  const cart = useCart();
  const [bagOpen, setBagOpen] = useState(false);
  const [homeSignal, setHomeSignal] = useState(0);

  const pendingNavigation = useRef<MutationObserver | null>(null);
  useEffect(() => () => pendingNavigation.current?.disconnect(), []);

  const navigateSection = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute("href");
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (!target) return;
    event.preventDefault();
    pendingNavigation.current?.disconnect();
    const scroll = () => {
      pendingNavigation.current?.disconnect();
      pendingNavigation.current = null;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      window.history.replaceState(window.history.state, "", hash);
    };
    if (document.querySelector(".detail-room")) {
      pendingNavigation.current = new MutationObserver(() => {
        if (!document.querySelector(".detail-room")) requestAnimationFrame(scroll);
      });
      pendingNavigation.current.observe(document.body, { childList: true, subtree: true });
      setHomeSignal((value) => value + 1);
    } else scroll();
  };

  return (
    <div id="top" className="stone min-h-screen text-foreground" onClick={navigateSection}>
      <Header count={cart.count} onBag={() => setBagOpen(true)} onHome={() => setHomeSignal((value) => value + 1)} />
      <main>
        <PerfumeScene homeSignal={homeSignal} onAdd={(id, size) => { cart.add(id, size); setBagOpen(true); }} />
        <Story />
      </main>
      <Footer />

      <Bag open={bagOpen} onClose={() => setBagOpen(false)} cart={cart} />
    </div>
  );
}

function Header({ count, onBag, onHome }: { count: number; onBag: () => void; onHome: () => void }) {
  return (
    <header className="boutique-header">
      <a href="#top" onClick={onHome} className="min-w-0 truncate font-serif text-2xl tracking-wide">
        Your product
      </a>
      <nav className="flex shrink-0 items-center gap-5 text-xs uppercase tracking-[0.2em] text-muted-foreground md:gap-8">
        <a href="#collection" onClick={onHome} className="hidden py-2 transition-colors hover:text-foreground sm:inline">Collection</a>
        <a href="#story" onClick={onHome} className="hidden py-2 transition-colors hover:text-foreground sm:inline">Our story</a>
        <BagButton count={count} onClick={onBag} />
      </nav>
    </header>
  );
}

function BagButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button variant="ghost"
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 border border-border px-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent focus-visible:bg-accent"
      aria-label={`Open bag, ${count} items`}
    >
      Bag
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>
    </Button>
  );
}

function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    section.classList.add("story-motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    section.querySelectorAll(".story-reveal").forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); section.classList.remove("story-motion-ready"); };
  }, []);
  return (
    <section ref={sectionRef} id="story" className="boutique-story">
      <img src={storyBackground} alt="" aria-hidden loading="lazy" className="story-texture" />
      <div className="story-inner">
        <div className="story-heading">
          <p className="story-eyebrow story-reveal"><span>01 / Our philosophy</span><span className="story-hairline" /></p>
          <h2><span className="story-title-line story-reveal">A presence.</span><em className="story-title-line story-reveal">An impression.</em></h2>
        </div>
        <div className="story-copy">
          <span className="story-star" aria-hidden="true">✧</span>
          <p className="story-reveal">Fragrance is a quiet form of expression. A trace of warmth, a familiar texture, a moment that stays with you.</p>
          <p className="story-reveal">Five distinct compositions. Each with its own character. Discover the one that feels like you.</p>
          <a href="#collection" className="story-link story-reveal">Explore the collection <span aria-hidden="true">↗</span></a>
        </div>
        <div className="story-footnote story-reveal"><span>Atmosphere / Texture / Contrast</span><span>The after-dark collection</span></div>
      </div>
    </section>
  );
}

function Footer() {
  const creditRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = creditRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="boutique-footer">
      <div className="footer-topline">
        <span className="footer-boutique">Your product</span>
        <nav aria-label="Footer"><a href="#collection">Collection</a><a href="#story">Our story</a><a href="#top">Back to top ↑</a></nav>
      </div>
      <div className="footer-credit-stage">
        <p ref={creditRef} className="auren-credit">
          <span className="auren-byline">Designed by</span>
          <span className="auren-name">AUREN</span>
        </p>
      </div>
      <div className="footer-baseline"><span>Concept fragrance boutique</span><span>Design that leaves an impression.</span></div>
    </footer>
  );
}

function Bag({ open, onClose, cart }: { open: boolean; onClose: () => void; cart: ReturnType<typeof useCart> }) {
  const [notice, setNotice] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) { setNotice(false); return; }
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} {...(open ? { "data-bag-open": "" } : {})} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-overlay transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog" aria-modal="true" aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-500 ease-[var(--ease-lux)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-serif text-3xl">Your bag</h2>
          <Button variant="ghost" ref={closeRef} onClick={onClose} tabIndex={open ? 0 : -1} className="min-h-11 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">Close</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl">Your bag is empty.</p>
              <p className="mt-2 text-sm text-muted-foreground">Discover the after-dark collection.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cart.items.map((it) => {
                const p = perfumes.find((x) => x.id === it.id);
                if (!p) return null;
                return (
                  <li key={it.id + it.size} className="flex gap-4 py-5">
                    <img
                      src={perfumeImages[p.id] ?? ""}
                      alt=""
                      aria-hidden
                      className="h-24 w-16 shrink-0 border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-serif text-xl">{p.name}</p>
                        <p className="text-sm">{formatNPR(p.prices[it.size] * it.qty)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{it.size} ml · {formatNPR(p.prices[it.size])}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <Button variant="ghost" tabIndex={open ? 0 : -1} aria-label="Decrease quantity" onClick={() => cart.setQty(it.id, it.size, it.qty - 1)} className="grid h-9 w-9 place-items-center border border-border transition-colors hover:bg-accent">−</Button>
                        <span className="w-4 text-center text-sm">{it.qty}</span>
                        <Button variant="ghost" tabIndex={open ? 0 : -1} aria-label="Increase quantity" onClick={() => cart.setQty(it.id, it.size, it.qty + 1)} className="grid h-9 w-9 place-items-center border border-border transition-colors hover:bg-accent">+</Button>
                        <Button variant="ghost" tabIndex={open ? 0 : -1} onClick={() => cart.remove(it.id, it.size)} className="ml-auto text-xs uppercase tracking-[0.15em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">Remove</Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="border-t border-border p-6">
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
              <span className="font-serif text-2xl">{formatNPR(cart.subtotal)}</span>
            </div>
            <Button variant="ghost" tabIndex={open ? 0 : -1} onClick={() => setNotice(true)} className="mt-5 min-h-12 w-full bg-primary text-sm uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90">
              Checkout
            </Button>
            {notice && (
              <p role="status" className="mt-4 border border-border p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Demo store.</strong> Ordering and payments are not connected, so no order has been placed and nothing has been charged.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
