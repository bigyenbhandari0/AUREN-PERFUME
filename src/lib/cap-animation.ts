export type CapProfile = {
  uncapped: string;
  background: string;
  capClip: string;
  bottleClip: string;
  capOrigin: string;
  productOrigin: string;
};
const paths = (id: string) => ({ uncapped: `/images/${id}-uncapped.webp`, background: `/images/${id}-background.webp` });
export const capProfiles: Record<string, CapProfile> = {
  "ember-veil": {
    ...paths("ember-veil"), capOrigin: "50% 28.7%", productOrigin: "50% 83.5%",
    capClip: "polygon(39.35% 23.2%,39.8% 22.6%,42% 22.1%,46% 21.7%,50% 21.6%,54% 21.7%,58% 22.1%,60.6% 22.6%,61.1% 23.2%,61.1% 35.1%,59.4% 35.6%,55% 35.8%,45% 35.8%,40.8% 35.6%,39.35% 35.1%)",
    bottleClip: "polygon(45.2% 28.3%,46% 28.1%,50% 28%,54% 28.1%,55% 28.3%,55% 32.5%,57.1% 32.9%,57.1% 36.9%,68.5% 37.4%,70.5% 37.9%,71.5% 39.1%,71.5% 81.5%,70.8% 82.8%,69% 83.5%,31% 83.5%,29.3% 82.8%,28.7% 81.5%,28.7% 39.1%,29.5% 37.9%,31.5% 37.4%,43.2% 36.9%,43.2% 32.9%,45.2% 32.5%)",
  },
  "rose-static": {
    ...paths("rose-static"), capOrigin: "49.9% 29%", productOrigin: "49.8% 81.5%",
    capClip: "ellipse(14.5% 8.1% at 49.9% 28.95%)",
    bottleClip: "polygon(44% 30%,56% 30%,56% 36.5%,59.7% 36.7%,59.7% 41.2%,66% 42%,72% 45%,76% 50%,78.5% 57%,78.8% 66%,77.5% 73%,74% 78%,68% 80.5%,59% 81.5%,41% 81.5%,32% 80.5%,26% 78%,22.5% 73%,20.5% 66%,20.5% 57%,23% 50%,27% 45%,34% 42%,39.5% 41.2%,39.5% 36.7%,44% 36.5%)",
  },
  "moss-theory": {
    ...paths("moss-theory"), capOrigin: "49.8% 31.2%", productOrigin: "49.8% 80.7%",
    capClip: "polygon(34% 31.6%,34.5% 29.7%,36% 28%,38.5% 26.3%,42% 25.1%,46% 24.5%,50% 24.3%,54% 24.5%,58% 25.2%,62% 26.5%,64.5% 28.3%,65.6% 30.2%,65.6% 32.5%,64% 35%,61% 37%,57% 38%,43% 38%,38% 37%,35% 34.6%)",
    bottleClip: "polygon(44% 31%,56% 31%,56% 37.4%,58% 37.4%,58% 41.6%,63% 42.4%,67.5% 44.2%,70% 47.8%,71% 51.5%,71% 78%,70% 79.6%,67% 80.7%,33% 80.7%,30% 79.6%,28.5% 78%,28.5% 51.5%,29.5% 47.8%,32% 44.2%,36.5% 42.4%,41.4% 41.6%,41.4% 37.4%,44% 37.4%)",
  },
  "blue-hour": {
    ...paths("blue-hour"), capOrigin: "50% 30.3%", productOrigin: "50% 82%",
    capClip: "polygon(38.3% 23.6%,39.5% 22.9%,43% 22.4%,48% 22.2%,52% 22.2%,57% 22.4%,60.5% 22.9%,61.9% 23.6%,61.9% 38%,59% 38.6%,41% 38.6%,38.3% 38%)",
    bottleClip: "polygon(44% 29%,56% 29%,56% 37.5%,59.7% 37.7%,59.7% 38.8%,70% 38.8%,73% 39.8%,74.3% 41%,74.3% 80.4%,72.5% 81.9%,27.5% 81.9%,26% 80.4%,26% 41%,27.3% 39.8%,30% 38.8%,40% 38.8%,40% 37.7%,44% 37.5%)",
  },
  "velvet-after": {
    ...paths("velvet-after"), capOrigin: "49.6% 24.1%", productOrigin: "49.5% 80.5%",
    capClip: "polygon(32.2% 20.4%,35.2% 18.9%,36.4% 18.5%,65.4% 18.5%,66.9% 19.4%,66.9% 28.1%,64% 29.7%,34% 29.7%,32.2% 29%)",
    bottleClip: "polygon(43% 23%,57% 23%,57% 28.9%,59% 29.6%,59% 35.6%,66.8% 36%,74% 39.4%,74% 76.8%,70% 79.7%,66% 80.5%,33% 80.5%,29% 79.7%,25% 76.8%,25% 39.4%,34% 36%,40% 35.6%,40% 29.6%,43% 28.9%)",
  },
};
export const EMBER_UNCAPPED = capProfiles["ember-veil"]!.uncapped;
export const EMBER_BACKGROUND = capProfiles["ember-veil"]!.background;
const cache = new Map<string, Promise<boolean>>();

/** Cache one decode per product; failed assets retain the original photograph. */
export function preloadPerfumeCap(id: string): Promise<boolean> {
  const profile = capProfiles[id];
  if (!profile) return Promise.resolve(false);
  if (!cache.has(id)) cache.set(id, (async () => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const images = [profile.uncapped, profile.background].map((src) => { const image = new Image(); image.src = src; return image; });
      return await Promise.race([
        Promise.all(images.map((image) => image.decode())).then(() => true),
        new Promise<boolean>((resolve) => { timeout = setTimeout(() => resolve(false), 2500); }),
      ]);
    } catch { return false; }
    finally { if (timeout) clearTimeout(timeout); }
  })());
  return cache.get(id)!;
}
