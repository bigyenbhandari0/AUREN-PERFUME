import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); vi.resetModules(); });
describe("Mobile fragrance layer loading", () => {
  it("uses a successful load event when mobile decode rejects", async () => {
    vi.resetModules();
    vi.stubGlobal("Image", class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) { queueMicrotask(() => this.onload?.()); }
      decode() { return Promise.reject(new Error("Mobile decode unavailable")); }
    });
    const { preloadPerfumeCap } = await import("@/lib/cap-animation");
    expect(await preloadPerfumeCap("rose-static")).toBe(true);
  });
  it("retries timed-out layers rather than permanently disabling their animation", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("Image", class { src = ""; decode() { return new Promise<void>(() => {}); } });
    const { preloadPerfumeCap } = await import("@/lib/cap-animation");
    const first = preloadPerfumeCap("moss-theory");
    await vi.advanceTimersByTimeAsync(15001);
    expect(await first).toBe(false);
    vi.stubGlobal("Image", class { src = ""; decode() { return Promise.resolve(); } });
    expect(await preloadPerfumeCap("moss-theory")).toBe(true);
  });
});
