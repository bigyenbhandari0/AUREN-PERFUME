import { afterEach, describe, expect, it, vi } from "vitest";
import { startupScrollScript } from "@/lib/startup-scroll";

afterEach(() => vi.restoreAllMocks());
describe("Homepage startup", () => {
  it("clears a saved section while preserving query parameters and router state", () => {
    window.history.replaceState({ key: "keep" }, "", "/?preview=1#story");
    const scroll = vi.spyOn(window, "scrollTo");
    new Function("window", startupScrollScript)(window);
    expect(window.location.hash).toBe("");
    expect(window.location.search).toBe("?preview=1");
    expect(window.history.state).toEqual({ key: "keep" });
    expect(window.history.scrollRestoration).toBe("manual");
    expect(scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    // Section links remain available after startup; navigation does not get reset.
    window.history.replaceState(window.history.state, "", "/#story");
    expect(window.location.hash).toBe("#story");
  });
});
