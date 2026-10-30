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
    bottleClip: "polygon(45.3125% 28.3203%,46.0938% 28.1250%,49.9023% 28.0599%,53.9062% 28.1250%,54.8828% 28.3203%,54.8828% 32.4219%,56.8359% 32.7474%,56.8359% 36.7839%,68.5% 37.4%,70.5% 37.9%,71.5% 39.1%,71.5% 81.5%,70.8% 82.8%,69% 83.5%,31% 83.5%,29.3% 82.8%,28.7% 81.5%,28.7% 39.1%,29.5% 37.9%,31.5% 37.4%,43.4570% 36.7839%,43.4570% 32.7474%,45.3125% 32.4219%)",
  },
  "rose-static": {
    ...paths("rose-static"), capOrigin: "49.9% 29%", productOrigin: "49.8% 81.5%",
    capClip: "ellipse(14.5% 8.1% at 49.9% 28.95%)",
    bottleClip: "polygon(45.5078% 32.4219%,46.2891% 32.2266%,49.9023% 32.1615%,53.6133% 32.2266%,54.3945% 32.4219%,54.3945% 35.8073%,55.2734% 36.0677%,55.2734% 36.5234%,59.4727% 36.9792%,59.4727% 41.1458%,66% 42%,72% 45%,76% 50%,78.5% 57%,78.8% 66%,77.5% 73%,74% 78%,68% 80.5%,59% 81.5%,41% 81.5%,32% 80.5%,26% 78%,22.5% 73%,20.5% 66%,20.5% 57%,23% 50%,27% 45%,34% 42%,40.2344% 41.1458%,40.2344% 36.9792%,44.4336% 36.5234%,44.4336% 36.0677%,45.5078% 35.8073%)",
  },
  "moss-theory": {
    ...paths("moss-theory"), capOrigin: "49.8% 31.2%", productOrigin: "49.8% 80.7%",
    capClip: "polygon(34% 31.6%,34.5% 29.7%,36% 28%,38.5% 26.3%,42% 25.1%,46% 24.5%,50% 24.3%,54% 24.5%,58% 25.2%,62% 26.5%,64.5% 28.3%,65.6% 30.2%,65.6% 32.5%,64% 35%,61% 37%,57% 38%,43% 38%,38% 37%,35% 34.6%)",
    bottleClip: "polygon(46.3867% 33.0078%,47.0703% 32.8125%,49.8047% 32.7474%,52.5391% 32.8125%,53.1250% 33.0078%,53.1250% 35.9375%,53.9062% 36.1979%,53.9062% 36.9792%,57.7148% 37.4349%,57.7148% 41.3411%,63% 42.4%,67.5% 44.2%,70% 47.8%,71% 51.5%,71% 78%,70% 79.6%,67% 80.7%,33% 80.7%,30% 79.6%,28.5% 78%,28.5% 51.5%,29.5% 47.8%,32% 44.2%,36.5% 42.4%,41.6992% 41.3411%,41.6992% 37.4349%,45.5078% 36.9792%,45.5078% 36.1979%,46.3867% 35.9375%)",
  },
  "blue-hour": {
    ...paths("blue-hour"), capOrigin: "50% 30.3%", productOrigin: "50% 82%",
    capClip: "polygon(38.3% 23.6%,39.5% 22.9%,43% 22.4%,48% 22.2%,52% 22.2%,57% 22.4%,60.5% 22.9%,61.9% 23.6%,61.9% 38%,59% 38.6%,41% 38.6%,38.3% 38%)",
    bottleClip: "polygon(45.4102% 29.4271%,46.2891% 29.1667%,50.0000% 29.1016%,53.6133% 29.1667%,54.6875% 29.4271%,54.6875% 33.7240%,56.8359% 34.1146%,56.8359% 37.8906%,59.3750% 38.1510%,59.3750% 38.7370%,70% 38.8%,73% 39.8%,74.3% 41%,74.3% 80.4%,72.5% 81.9%,27.5% 81.9%,26% 80.4%,26% 41%,27.3% 39.8%,30% 38.8%,40.5273% 38.7370%,40.5273% 38.1510%,43.1641% 37.8906%,43.1641% 34.1146%,45.4102% 33.7240%)",
  },
  "velvet-after": {
    ...paths("velvet-after"), capOrigin: "49.6% 24.1%", productOrigin: "49.5% 80.5%",
    capClip: "polygon(32.2% 20.4%,35.2% 18.9%,36.4% 18.5%,65.4% 18.5%,66.9% 19.4%,66.9% 28.1%,64% 29.7%,34% 29.7%,32.2% 29%)",
    bottleClip: "polygon(45.3125% 23.5677%,46.0938% 23.3724%,49.9023% 23.2422%,53.5156% 23.3724%,54.1992% 23.5677%,54.1992% 27.4740%,57.4219% 27.8646%,57.4219% 28.9062%,58.7891% 29.4922%,58.7891% 35.3516%,66.8% 36%,74% 39.4%,74% 76.8%,70% 79.7%,66% 80.5%,33% 80.5%,29% 79.7%,25% 76.8%,25% 39.4%,34% 36%,40.4297% 35.3516%,40.4297% 29.4922%,41.9922% 28.9062%,41.9922% 27.8646%,45.3125% 27.4740%)",
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
