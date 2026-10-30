import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Bottle } from "@/components/Bottle";
import { perfumes, formatNPR, type Perfume, type Size } from "@/lib/perfumes";
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
    ],
  }),
  component: Index,
});

const glowStyle = (p: Perfume) => ({ "--glow": p.glow }) as CSSProperties;

function Index() {
  const cart = useCart();
  const [bagOpen, setBagOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="stone min-h-screen text-foreground">
      <Header count={cart.count} onBag={() => setBagOpen(true)} onHome={() => setActive(null)} />
      <main>
        <Gallery onSelect={setActive} />
        <section id="story" className="mx-auto max-w-3xl border-t border-border px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our story</p>
          <h2 className="mt-6 font-serif text-4xl md:text-6xl">Designed to be remembered.</h2>
          <p className="mx-auto mt-8 max-w-xl leading-relaxed text-muted-foreground">
            Your product explores fragrance through atmosphere, texture, and contrast. Five original compositions, each with
            its own character, created for the moments you make your own.
          </p>
        </section>
      </main>
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <span className="font-serif text-xl text-foreground">Your product</span>
          <a href="#collection" className="hover:text-foreground">Collection</a>
          <span>Concept fragrance boutique</span>
        </div>
      </footer>

      {active !== null && (
        <Detail
          index={active}
          onChange={setActive}
          onClose={() => setActive(null)}
          onAdd={(id, size) => {
            cart.add(id, size);
            setBagOpen(true);
          }}
          bagCount={cart.count}
          onBag={() => setBagOpen(true)}
        />
      )}
      <Bag open={bagOpen} onClose={() => setBagOpen(false)} cart={cart} />
    </div>
  );
}

function Header({ count, onBag, onHome }: { count: number; onBag: () => void; onHome: () => void }) {
  return (
    <header className="relative z-30 mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-5 md:px-10">
      <a href="#top" onClick={onHome} className="min-w-0 truncate font-serif text-2xl tracking-wide">
        Your product
      </a>
      <nav className="flex shrink-0 items-center gap-5 text-xs uppercase tracking-[0.2em] text-muted-foreground md:gap-8">
        <a href="#collection" onClick={onHome} className="hidden py-2 hover:text-foreground sm:inline">Collection</a>
        <a href="#story" onClick={onHome} className="hidden py-2 hover:text-foreground sm:inline">Our story</a>
        <BagButton count={count} onClick={onBag} />
      </nav>
    </header>
  );
}

function BagButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-11 items-center gap-2 border border-border px-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent" aria-label={`Open bag, ${count} items`}>
      Bag
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>
    </button>
  );
}

function Gallery({ onSelect }: { onSelect: (i: number) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
    setPos(Math.round(el.scrollLeft / (w + 12)));
  };

  return (
    <section id="collection" className="px-0 md:px-10">
      {/* desktop */}
      <div className="mx-auto hidden max-w-[1600px] grid-cols-5 gap-3 md:grid">
        {perfumes.map((p, i) => (
          <NicheCard key={p.id} p={p} onClick={() => onSelect(i)} className="h-[72vh] min-h-[520px]" />
        ))}
      </div>
      {/* mobile */}
      <div className="md:hidden">
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {perfumes.map((p, i) => (
            <NicheCard key={p.id} p={p} onClick={() => onSelect(i)} className="h-[64vh] min-h-[440px] w-[78vw] shrink-0 snap-center" />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between px-5">
          <div className="flex gap-2" aria-hidden>
            {perfumes.map((p, i) => (
              <span key={p.id} className={`h-px transition-all duration-500 ${i === pos ? "w-8 bg-foreground" : "w-4 bg-muted-foreground/50"}`} />
            ))}
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Swipe to explore →</span>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-5 pb-10 md:px-0">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A presence that lingers.</p>
        <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
          The <em className="italic text-primary">after-dark</em> collection
        </h1>
        <p className="mt-4 text-muted-foreground">Five expressions. One lasting impression.</p>
      </div>
    </section>
  );
}

function NicheCard({ p, onClick, className = "" }: { p: Perfume; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      style={glowStyle(p)}
      className={`niche group flex flex-col items-center justify-end text-left hover:[box-shadow:inset_0_0_40px_oklch(0_0_0/60%)] [&:hover::before]:opacity-100 ${className}`}
      aria-label={`Discover ${p.name}`}
    >
      <div className="niche-floor" />
      <div className="relative mb-[14%] flex w-full flex-col items-center">
        <div className="w-[62%] max-w-[190px] transition-transform duration-700 ease-[var(--ease-lux)] group-hover:-translate-y-3 group-focus-visible:-translate-y-3">
          <Bottle id={p.id} name={p.name} className="w-full drop-shadow-[0_20px_30px_oklch(0_0_0/0.7)]" />
          <Bottle id={p.id} name={p.name} className="reflect -mt-1 h-16 w-full object-top" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
        <span className="font-serif text-xl">{p.name}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
          Discover →
        </span>
      </div>
    </button>
  );
}

function Detail({
  index, onChange, onClose, onAdd, bagCount, onBag,
}: {
  index: number; onChange: (i: number) => void; onClose: () => void;
  onAdd: (id: string, s: Size) => void; bagCount: number; onBag: () => void;
}) {
  const p = perfumes[index];
  const [size, setSize] = useState<Size>("50");
  const n = perfumes.length;
  const prev = () => onChange((index - 1 + n) % n);
  const next = () => onChange((index + 1) % n);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (document.querySelector("[data-bag-open]")) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  });

  return (
    <div role="dialog" aria-modal="true" aria-label={p.name} className="stone fade-up fixed inset-0 z-40 overflow-y-auto" style={glowStyle(p)}>
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <span className="font-serif text-2xl">Your product</span>
        <BagButton count={bagCount} onClick={onBag} />
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 pb-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16 md:px-10">
        <div key={p.id} className="fade-up order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} — {p.character}
          </p>
          <h2 className="mt-4 font-serif text-5xl md:text-7xl">{p.name}</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{p.description}</p>
          <dl className="mt-8 max-w-md divide-y divide-border border-y border-border text-sm">
            {["Top", "Heart", "Base"].map((l, i) => (
              <div key={l} className="flex justify-between py-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</dt>
                <dd>{p.notes[i]}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex items-center gap-3" role="radiogroup" aria-label="Size">
            {(["50", "100"] as Size[]).map((s) => (
              <button
                key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)}
                className={`min-h-11 border px-5 text-sm transition-colors ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
              >
                {s} ml
              </button>
            ))}
            <span className="ml-auto font-serif text-2xl md:ml-4">{formatNPR(p.prices[size])}</span>
          </div>
          <button
            onClick={() => onAdd(p.id, size)}
            className="mt-6 min-h-12 w-full max-w-md bg-primary text-sm uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add to bag
          </button>
          <div className="mt-10 flex max-w-md items-center justify-between text-xs uppercase tracking-[0.2em]">
            <button onClick={onClose} className="min-h-11 text-muted-foreground hover:text-foreground">← Back to collection</button>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous perfume" className="grid h-11 w-11 place-items-center border border-border hover:bg-accent">‹</button>
              <button onClick={next} aria-label="Next perfume" className="grid h-11 w-11 place-items-center border border-border hover:bg-accent">›</button>
            </div>
          </div>
        </div>
        <div className="niche order-1 flex h-[56vh] items-end justify-center md:order-2 md:h-[80vh]">
          <div className="niche-floor" />
          <div key={p.id} className="fade-up relative mb-[8%] w-[48%] max-w-[300px]">
            <Bottle id={p.id} name={p.name} className="w-full drop-shadow-[0_30px_40px_oklch(0_0_0/0.75)]" />
          </div>
        </div>
      </div>
    </div>
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
          <button ref={closeRef} onClick={onClose} tabIndex={open ? 0 : -1} className="min-h-11 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Close</button>
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
                const p = perfumes.find((x) => x.id === it.id)!;
                return (
                  <li key={it.id + it.size} className="flex gap-4 py-5">
                    <div className="niche flex h-24 w-16 shrink-0 items-end justify-center" style={glowStyle(p)}>
                      <Bottle id={p.id} name={p.name} className="relative mb-1 w-10" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-serif text-xl">{p.name}</p>
                        <p className="text-sm">{formatNPR(p.prices[it.size] * it.qty)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{it.size} ml · {formatNPR(p.prices[it.size])}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button tabIndex={open ? 0 : -1} aria-label="Decrease quantity" onClick={() => cart.setQty(it.id, it.size, it.qty - 1)} className="grid h-9 w-9 place-items-center border border-border hover:bg-accent">−</button>
                        <span className="w-4 text-center text-sm">{it.qty}</span>
                        <button tabIndex={open ? 0 : -1} aria-label="Increase quantity" onClick={() => cart.setQty(it.id, it.size, it.qty + 1)} className="grid h-9 w-9 place-items-center border border-border hover:bg-accent">+</button>
                        <button tabIndex={open ? 0 : -1} onClick={() => cart.remove(it.id, it.size)} className="ml-auto text-xs uppercase tracking-[0.15em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Remove</button>
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
            <button tabIndex={open ? 0 : -1} onClick={() => setNotice(true)} className="mt-5 min-h-12 w-full bg-primary text-sm uppercase tracking-[0.25em] text-primary-foreground hover:opacity-90">
              Checkout
            </button>
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
