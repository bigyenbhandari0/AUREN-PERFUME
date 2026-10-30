/** Runs in the document head, before a saved hash can jump to a lower section. */
export const startupScrollScript = `(() => {
  const reset = () => {
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  reset();
  try {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.sessionStorage.getItem("auren-collection-revealed") !== "1") {
      window.document.documentElement.classList.add("collection-unveiling");
      // Never leave the collection covered if hydration fails.
      window.setTimeout(() => window.document.documentElement.classList.remove("collection-unveiling"), 3000);
    }
  } catch { /* A blocked session store should not block the collection. */ }
  window.addEventListener("pageshow", (event) => { if (event.persisted) reset(); });
})();`;
