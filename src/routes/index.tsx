import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ProductPhoto } from "@/components/ProductPhoto";
import { perfumes, formatNPR, type Perfume, type Size } from "@/lib/perfumes";
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
        <Story />
      </main>
      <Footer />

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
    <header className="relative z-30 mx-auto flex max-w-[1600px] items-center justify-between gap-4 border-b border-border px-5 py-5 md:px-10">
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
    <button
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 border border-border px-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent focus-visible:bg-accent"
      aria-label={`Open bag, ${count} items`}
    >
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
    <section id="collection" className="pt-10 md:pt-14">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A presence that lingers.</p>
        <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
          The <em className="italic text-primary">after-dark</em> collection
        </h1>
        <p className="mt-4 text-muted-foreground">Five expressions. One lasting impression.</p>
      </div>

      {/* desktop: five adjacent panels with fine dividers */}
      <div className="mx-auto mt-12 hidden max-w-[1600px] grid-cols-5 gap-px bg-border px-0 md:grid md:border-y md:border-border">
        {perfumes.map((p, i) => (
          <NicheCard key={p.id} p={p} onClick={() => onSelect(i)} />
        ))}
      </div>

      {/* mobile: swipeable snap panels with a glimpse of the next */}
      <div className="mt-10 md:hidden">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
        >
          {perfumes.map((p, i) => (
            <NicheCard key={p.id} p={p} onClick={() => onSelect(i)} className="w-[78vw] shrink-0 snap-center" />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between px-5">
          <div className="flex gap-2" aria-hidden>
            {perfumes.map((p, i) => (
              <span
                key={p.id}
                className={`h-px transition-all duration-500 ${i === pos ? "w-8 bg-foreground" : "w-4 bg-muted-foreground/50"}`}
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Swipe to explore →</span>
        </div>
      </div>
    </section>
  );
}

function NicheCard({ p, onClick, className = "" }: { p: Perfume; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      style={glowStyle(p)}
      className={`group flex flex-col bg-background text-left transition-colors focus-visible:bg-accent ${className}`}
      aria-label={`Discover ${p.name}`}
    >
      <ProductPhoto
        src={perfumeImages[p.id]!}
        alt={`${p.name} eau de parfum bottle in a lit stone niche`}
        glow={p.glow}
        className="aspect-[2/3] w-full"
      />
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-4">
        <span className="font-serif text-xl">{p.name}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
          Discover ↗
        </span>
      </div>
    </button>
  );
}

function Story() {
  return (
    <section id="story" className="relative mt-24 overflow-hidden border-t border-border">
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
          <span className="auren-name font-medium uppercase tracking-[0.35em] text-primary">Auren</span>
        </p>
      </div>
    </footer>
  );
}

function Detail({
  index, onChange, onClose, onAdd, bagCount, onBag,
}: {
  index: number; onChange: (i: number) => void; onClose: () => void;
  onAdd: (id: string, s: Size) => void; bagCount: number; onBag: () => void;
}) {
  const p = perfumes[index]!;
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
      <div className="flex items-center justify-between border-b border-border px-5 py-5 md:px-10">
        <span className="font-serif text-2xl">Your product</span>
        <BagButton count={bagCount} onClick={onBag} />
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 pb-10 pt-8 md:grid-cols-2 md:items-center md:gap-16 md:px-10">
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
            <button onClick={onClose} className="min-h-11 text-muted-foreground transition-colors hover:text-foreground">← Back to collection</button>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous perfume" className="grid h-11 w-11 place-items-center border border-border transition-colors hover:bg-accent">‹</button>
              <button onClick={next} aria-label="Next perfume" className="grid h-11 w-11 place-items-center border border-border transition-colors hover:bg-accent">›</button>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <ProductPhoto
            key={p.id}
            src={perfumeImages[p.id]!}
            alt={`${p.name} eau de parfum bottle in a lit stone niche`}
            glow={p.glow}
            loading="eager"
            className="fade-up mx-auto aspect-[2/3] w-full max-w-[440px] border border-border"
          />
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
          <button ref={closeRef} onClick={onClose} tabIndex={open ? 0 : -1} className="min-h-11 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">Close</button>
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
                    <img
                      src={perfumeImages[p.id]!}
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
                        <button tabIndex={open ? 0 : -1} aria-label="Decrease quantity" onClick={() => cart.setQty(it.id, it.size, it.qty - 1)} className="grid h-9 w-9 place-items-center border border-border transition-colors hover:bg-accent">−</button>
                        <span className="w-4 text-center text-sm">{it.qty}</span>
                        <button tabIndex={open ? 0 : -1} aria-label="Increase quantity" onClick={() => cart.setQty(it.id, it.size, it.qty + 1)} className="grid h-9 w-9 place-items-center border border-border transition-colors hover:bg-accent">+</button>
                        <button tabIndex={open ? 0 : -1} onClick={() => cart.remove(it.id, it.size)} className="ml-auto text-xs uppercase tracking-[0.15em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">Remove</button>
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
            <button tabIndex={open ? 0 : -1} onClick={() => setNotice(true)} className="mt-5 min-h-12 w-full bg-primary text-sm uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90">
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
