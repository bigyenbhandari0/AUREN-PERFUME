import { useLayoutEffect, useRef, useState } from "react";

export function CollectionReveal({ onActive }: { onActive: (active: boolean) => void }) {
  const [active, setActive] = useState(false);
  const finishRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("collection-unveiling")) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove("collection-unveiling");
      try { sessionStorage.setItem("auren-collection-revealed", "1"); } catch { /* Storage can be unavailable in private browsing. */ }
      setActive(false);
      onActive(false);
    };
    finishRef.current = finish;
    setActive(true);
    onActive(true);
    const timer = window.setTimeout(finish, 2700);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = () => { if (preference.matches) finish(); };
    preference.addEventListener?.("change", reduceMotion);
    window.addEventListener("keydown", escape);
    return () => { clearTimeout(timer); preference.removeEventListener?.("change", reduceMotion); window.removeEventListener("keydown", escape); };
  }, [onActive]);
  return (
    <div className="collection-reveal" aria-hidden={!active} inert={!active} aria-label="Collection introduction">
      <div className="reveal-panel reveal-panel-left" aria-hidden="true" />
      <div className="reveal-panel reveal-panel-right" aria-hidden="true" />
      <div className="reveal-title" aria-hidden="true"><span>A presence that lingers</span><p>The <em>after-dark</em> collection</p><i /></div>
      <button className="reveal-skip" tabIndex={active ? 0 : -1} onClick={() => finishRef.current()}>Skip intro ↗</button>
    </div>
  );
}
