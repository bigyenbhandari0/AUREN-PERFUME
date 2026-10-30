import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CollectionReveal } from "@/components/CollectionReveal";

beforeEach(() => { vi.useFakeTimers(); sessionStorage.clear(); document.documentElement.classList.add("collection-unveiling"); });
afterEach(() => { cleanup(); vi.useRealTimers(); document.documentElement.classList.remove("collection-unveiling"); });
describe("Collection entrance", () => {
  it("uncovers the collection and records session completion", () => {
    const onActive = vi.fn();
    render(<CollectionReveal onActive={onActive} />);
    expect(onActive).toHaveBeenLastCalledWith(true);
    act(() => { vi.advanceTimersByTime(2699); });
    expect(document.documentElement).toHaveClass("collection-unveiling");
    act(() => { vi.advanceTimersByTime(1); });
    expect(document.documentElement).not.toHaveClass("collection-unveiling");
    expect(sessionStorage.getItem("auren-collection-revealed")).toBe("1");
    expect(onActive).toHaveBeenLastCalledWith(false);
  });
  it("allows immediate skipping", () => {
    const onActive = vi.fn();
    render(<CollectionReveal onActive={onActive} />);
    fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
    expect(document.documentElement).not.toHaveClass("collection-unveiling");
    act(() => { vi.advanceTimersByTime(2700); });
    expect(onActive.mock.calls.filter(([active]) => active === false)).toHaveLength(1);
  });
});
