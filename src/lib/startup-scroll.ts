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
  window.addEventListener("pageshow", (event) => { if (event.persisted) reset(); });
})();`;
