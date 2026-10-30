import { readFileSync } from "node:fs";
const css = readFileSync(`${process.cwd()}/src/styles.css`, "utf8");
import { describe, expect, it } from "vitest";

function poses(name: string) {
  const body = css.split(`@keyframes ${name} {`)[1]?.split("\n}")[0] ?? "";
  return [...body.matchAll(/translate\(([-\d.]+)%,([-\d.]+)%\) rotate\(([-\d.]+)deg\)/g)]
    .map((match) => match.slice(1).map(Number));
}

describe("Floating motion handoff", () => {
  it.each(["bottle-hover", "cap-hover"])("%s settles at its loop seam without a position or speed jump", (name) => {
    const frames = poses(name);
    expect(frames.length).toBeGreaterThan(2);
    const first = frames[0]!;
    const last = frames[frames.length - 1]!;
    first.forEach((value, axis) => {
      expect(last[axis]).toBeCloseTo(value, 4);
      expect(Math.abs(frames[1]![axis]! - value)).toBeLessThan(0.001);
      expect(Math.abs(last[axis]! - frames[frames.length - 2]![axis]!)).toBeLessThan(0.001);
    });
    expect(first[1]).toBeCloseTo(name === "cap-hover" ? -10.26667 : -2.26667, 4);
    expect(first[2]).toBeCloseTo(name === "cap-hover" ? 1.4 : -0.6, 4);
  });
});
