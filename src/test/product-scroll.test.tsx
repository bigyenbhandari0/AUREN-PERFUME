import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerfumeScene } from "@/components/PerfumeScene";

beforeEach(() => {
  Object.defineProperty(HTMLImageElement.prototype, "decode", { configurable: true, writable: true, value: vi.fn().mockResolvedValue(undefined) });
  Element.prototype.animate = vi.fn(() => ({ finished: Promise.resolve(), cancel: vi.fn() })) as unknown as typeof Element.prototype.animate;
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Product scroll isolation", () => {
  it("returns focus after Escape without leaving the gallery spotlight selected", async () => {
    render(<PerfumeScene homeSignal={0} onAdd={() => {}} />);
    const product = screen.getByRole("button", { name: "Discover Moss Theory" });
    fireEvent.click(product);
    await waitFor(() => expect(document.querySelector(".phase-detail")).not.toBeNull());
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(product).toHaveAttribute("data-restored-focus"));
    expect(document.querySelector(".phase-collection")).not.toBeNull();
    expect(product).toHaveFocus();
    fireEvent.blur(product);
    expect(product).not.toHaveAttribute("data-restored-focus");
  });
  it("locks the document, carries the scene with dialog scrolling, and restores it on return", async () => {
    render(<PerfumeScene homeSignal={0} onAdd={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Discover Ember Veil" }));
    await waitFor(() => expect(document.querySelector(".phase-detail")).not.toBeNull());
    // Only the selected photograph uses animated cutouts; gallery photos stay intact.
    expect(document.querySelectorAll(".photo-product-rig")).toHaveLength(2);
    expect(document.body.style.position).toBe("fixed");
    expect(document.documentElement.style.overflow).toBe("hidden");
    const dialog = screen.getByRole("dialog");
    fireEvent.scroll(dialog, { target: { scrollTop: 180 } });
    expect((document.querySelector(".camera-world") as HTMLElement).style.translate).toBe("0px -180px");
    fireEvent.click(screen.getByRole("button", { name: "Back to collection" }));
    await waitFor(() => expect(document.querySelector(".phase-collection")).not.toBeNull());
    expect(document.querySelectorAll(".photo-product-rig")).toHaveLength(0);
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect((document.querySelector(".camera-world") as HTMLElement).style.translate).toBe("");
  });
});
