import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProductPhoto } from "@/components/ProductPhoto";
import { EMBER_UNCAPPED } from "@/lib/cap-animation";

afterEach(cleanup);
describe("Ember cap layers", () => {
  it("uses the same separated cap and uncapped base in the source and mirror", () => {
    const { container } = render(<ProductPhoto src="/original.png" alt="Ember Veil" glow="oklch(0.78 0.14 70)" capAnimation />);
    expect(container.querySelectorAll(`img[src="${EMBER_UNCAPPED}"]`)).toHaveLength(2);
    const caps = container.querySelectorAll(".photo-cap");
    expect(caps).toHaveLength(2);
    caps.forEach((cap) => expect(cap).toHaveAttribute("src", "/original.png"));
  });
  it("keeps other products intact and provides a closed-bottle fallback", () => {
    const { container } = render(<ProductPhoto src="/original.png" alt="Perfume" glow="oklch(0.78 0.14 70)" />);
    expect(container.querySelector(".photo-cap")).toBeNull();
    expect(container.querySelectorAll('img[src="/original.png"]')).toHaveLength(2);
  });
});
