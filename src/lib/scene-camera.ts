export type SceneRect = { left: number; top: number; width: number; height: number };
export const CAMERA_DURATION = 1050;

/** Uniform camera movement preserves the complete photographic composition. */
export function cameraTransform(source: SceneRect, target: SceneRect) {
  const scale = Math.min(target.width / source.width, target.height / source.height);
  return {
    scale,
    x: target.left + (target.width - source.width * scale) / 2 - source.left * scale,
    y: target.top + (target.height - source.height * scale) / 2 - source.top * scale,
  };
}