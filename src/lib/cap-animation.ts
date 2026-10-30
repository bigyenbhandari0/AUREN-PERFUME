export const EMBER_UNCAPPED = "/images/ember-veil-uncapped.webp";
export const EMBER_BACKGROUND = "/images/ember-veil-background.webp";
let ready: Promise<boolean> | undefined;

/** One shared decode for the camera and both photographic layers. */
export function preloadEmberCap(): Promise<boolean> {
  if (!ready) {
    ready = (async () => {
      try {
        const images = [EMBER_UNCAPPED, EMBER_BACKGROUND].map((src) => { const image = new Image(); image.src = src; return image; });
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          return await Promise.race([
            Promise.all(images.map((image) => image.decode())).then(() => true),
            new Promise<boolean>((resolve) => { timeout = setTimeout(() => resolve(false), 2500); }),
          ]);
        } finally { if (timeout) clearTimeout(timeout); }
      } catch { return false; }
    })();
  }
  return ready;
}
