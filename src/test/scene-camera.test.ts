import { describe, expect, it } from "vitest";
import { CAMERA_DURATION, cameraTransform } from "@/lib/scene-camera";

describe("Continuous camera", () => {
  it("uses a cinematic duration within the requested 900–1200ms", () => {
    expect(CAMERA_DURATION).toBeGreaterThanOrEqual(900);
    expect(CAMERA_DURATION).toBeLessThanOrEqual(1200);
  });
  it("carries the same scene to the destination without distorting it", () => {
    const source = { left: 100, top: 80, width: 200, height: 300 };
    const target = { left: 700, top: 100, width: 400, height: 600 };
    const camera = cameraTransform(source, target);
    expect(camera.scale).toBe(2);
    expect(source.left * camera.scale + camera.x).toBe(700);
    expect(source.top * camera.scale + camera.y).toBe(100);
  });
  it("preserves proportions when mobile destination geometry differs", () => {
    const camera = cameraTransform({ left: 0, top: 0, width: 200, height: 300 }, { left: 20, top: 50, width: 300, height: 300 });
    expect(camera.scale).toBe(1);
    expect(camera.x).toBe(70);
    expect(camera.y).toBe(50);
  });
});