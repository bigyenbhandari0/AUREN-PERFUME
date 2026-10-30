import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

  return (
    <div className="stone min-h-screen text-foreground">
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
  return (
    <section id="story" className="relative overflow-hidden border-t border-border">
      <img
        src={storyBackground}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/78" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our story</p>
        <h2 className="mt-6 font-serif text-4xl md:text-6xl">Designed to be remembered.</h2>
        <p className="mx-auto mt-8 max-w-xl leading-relaxed text-muted-foreground">
          Your product explores fragrance through atmosphere, texture, and contrast. Five original compositions, each with
          its own character, created for the moments you make your own.
        </p>
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
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <span className="font-serif text-xl text-foreground">Your product</span>
        <a href="#collection" className="transition-colors hover:text-foreground">Collection</a>
        <span>Concept fragrance boutique</span>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-border pt-10 pb-4 text-center">
        <p ref={creditRef} className="auren-credit text-sm">
          <span className="text-muted-foreground">Designed by </span>
          <span className="auren-name font-medium uppercase tracking-[0.35em] text-primary">AUREN</span>
        </p>
      </div>
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
