export const EMBER_UNCAPPED = "/images/ember-veil-uncapped.webp";
let ready: Promise<boolean> | undefined;

/** One shared decode for the camera and both photographic layers. */
export function preloadEmberCap(): Promise<boolean> {
  if (!ready) {
    ready = (async () => {
      try {
        const image = new Image();
        image.src = EMBER_UNCAPPED;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          return await Promise.race([
            image.decode().then(() => true),
            new Promise<boolean>((resolve) => { timeout = setTimeout(() => resolve(false), 2500); }),
          ]);
        } finally { if (timeout) clearTimeout(timeout); }
      } catch { return false; }
    })();
  }
  return ready;
}
